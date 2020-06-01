import { randomBytes } from 'crypto'
import { promisify } from 'util'

import { locateBinding } from '@node-rs/helper'
import { flatbuffers } from 'flatbuffers'

import { argon2 } from './src/option_generated'

const bindings = require(locateBinding(__dirname, 'argon2'))

const randomBytesAsync = promisify(randomBytes)

export const Argon2Type = argon2.Argon2Type
export const Version = argon2.Version

export type Options = {
  associatedData?: Buffer
  hashLength?: number
  parallelism?: number
  memoryCost?: number
  secret?: Buffer
  timeCost?: number
  variant?: argon2.Argon2Type
  version?: argon2.Version
  salt?: Buffer
  saltLength?: number
}

export const defaults: Required<Omit<Options, 'salt'>> = {
  hashLength: 32,
  timeCost: 3,
  memoryCost: 4096,
  parallelism: 1,
  variant: Argon2Type.I,
  version: Version.Version10,
  associatedData: Buffer.alloc(0),
  secret: Buffer.alloc(0),
  saltLength: 16,
}

export function hash(plain: Buffer | string, options: Options & { raw: true }): Promise<Buffer>
export function hash(plain: Buffer | string, options?: Options & { raw?: false }): Promise<string>

export async function hash(
  input: string | Buffer,
  options: Options & { raw?: boolean } = {},
): Promise<Buffer | string> {
  const hashInput = Buffer.isBuffer(input) ? input : Buffer.from(input)
  const optionsBuilder = new flatbuffers.Builder(0)
  const adOffset = argon2.Options.createAssociatedDataVector(
    optionsBuilder,
    new Uint8Array((options.associatedData ?? defaults.associatedData).buffer),
  )
  const secretOffset = argon2.Options.createSecretVector(
    optionsBuilder,
    new Uint8Array((options.secret ?? defaults.secret).buffer),
  )

  const opt = argon2.Options.createOptions(
    optionsBuilder,
    adOffset,
    options.hashLength ?? defaults.hashLength,
    options.parallelism ?? defaults.parallelism,
    options.memoryCost ?? defaults.memoryCost,
    secretOffset,
    options.timeCost ?? defaults.timeCost,
    options.variant ?? defaults.variant,
    options.version ?? defaults.version,
  )
  optionsBuilder.finish(opt)

  const salt = options.salt ?? (await randomBytesAsync(options.saltLength ?? defaults.saltLength))

  return bindings.hash(hashInput, salt, Buffer.from(optionsBuilder.asUint8Array()))
}
