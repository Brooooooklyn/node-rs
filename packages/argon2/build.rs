extern crate napi_build;

use std::path::PathBuf;
use std::process;

fn main() {
  napi_build::setup();

  let mut p = PathBuf::new();
  p.push("option.fbs");

  let mut output_path = PathBuf::new();
  output_path.push("src");

  assert!(process::Command::new("flatc")
    .current_dir(output_path)
    .args(&["-r", "-T", p.as_path().to_str().unwrap()])
    .status()
    .unwrap()
    .success());
}
