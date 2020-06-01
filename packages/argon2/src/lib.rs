#[macro_use]
extern crate napi_rs as napi;
#[macro_use]
extern crate napi_rs_derive;

use argon2::{hash_raw, Config, ThreadMode, Variant, Version};
use flatbuffers::get_root;
use napi::{Buffer, CallContext, Env, Error, Object, Result, Status, Task, Value};
use option_generated::argon_2;

#[allow(dead_code, unused_imports)]
#[path = "./option_generated.rs"]
mod option_generated;

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

register_module!(argon2, init);

fn init(env: &Env, exports: &mut Value<Object>) -> Result<()> {
  exports.set_property(
    env.create_string("hash")?,
    env.create_function("hash", hash)?,
  )?;
  Ok(())
}

#[js_function(3)]
fn hash(ctx: CallContext) -> Result<Value<Object>> {
  let input = ctx.get::<Buffer>(0)?;
  let salt = ctx.get::<Buffer>(1)?;
  let options_buffer = ctx.get::<Buffer>(2)?;
  let task = Argon2Task::new(input, salt, options_buffer);
  ctx.env.spawn(task)
}

#[inline]
fn convert_version(v: argon_2::Version) -> Version {
  match v {
    argon_2::Version::Version10 => Version::Version10,
    argon_2::Version::Version13 => Version::Version13,
  }
}

#[inline]
fn convert_variant(v: argon_2::Argon2Type) -> Variant {
  match v {
    argon_2::Argon2Type::D => Variant::Argon2d,
    argon_2::Argon2Type::I => Variant::Argon2i,
    argon_2::Argon2Type::ID => Variant::Argon2id,
  }
}

struct Argon2Task {
  data: Value<Buffer>,
  salt: Value<Buffer>,
  config: Value<Buffer>,
}

impl Argon2Task {
  fn new(data: Value<Buffer>, salt: Value<Buffer>, config: Value<Buffer>) -> Self {
    Self { data, salt, config }
  }
}

impl Task for Argon2Task {
  type Output = Vec<u8>;
  type JsValue = Buffer;

  fn compute(&self) -> Result<Self::Output> {
    let options = get_root::<argon_2::Options>(&self.config);
    let mut conf = Config::default();
    let ad = options.associatedData().unwrap();
    conf.ad = ad;
    let secret = options.secret().unwrap();
    conf.secret = secret;
    let parallelism = options.parallelism();
    if parallelism <= 1 {
      conf.thread_mode = ThreadMode::Sequential;
    } else {
      conf.thread_mode = ThreadMode::Parallel;
      conf.lanes = parallelism;
    }
    conf.mem_cost = options.memoryCost();
    conf.time_cost = options.timeCost();
    conf.version = convert_version(options.version());
    conf.variant = convert_variant(options.variant());
    hash_raw(&self.data, &self.salt, &conf).map_err(|e| Error {
      status: Status::GenericFailure,
      reason: Some(format!("hash password failed: {:?}", e)),
    })
  }

  fn resolve(&self, env: &mut Env, output: Self::Output) -> Result<Value<Self::JsValue>> {
    env.create_buffer_with_data(output)
  }
}
