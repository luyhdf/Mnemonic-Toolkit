import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

console.log('Testing bip39 functionality...')

// Generate a random mnemonic
const mnemonic = bip39.generateMnemonic(wordlist)
console.log('Generated mnemonic:', mnemonic)

const mn256 = bip39.generateMnemonic(wordlist, 256);
console.log(mn256);

// Mnemonic to seed sync
const seed = bip39.mnemonicToSeedSync(mnemonic)
console.log('Seed hex:', Buffer.from(seed).toString('hex'))

console.log('Seed buffer:', seed)

// Validate mnemonic
console.log('Validate valid mnemonic:', bip39.validateMnemonic(mnemonic, wordlist))
console.log('Validate invalid mnemonic:', bip39.validateMnemonic('basket actual', wordlist))
