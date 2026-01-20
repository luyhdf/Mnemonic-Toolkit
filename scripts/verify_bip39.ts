import * as bip39 from 'bip39'

console.log('Testing bip39 functionality...')

// Generate a random mnemonic
const mnemonic = bip39.generateMnemonic()
console.log('Generated mnemonic:', mnemonic)

const mnenonicSeedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
console.log('Mnemonic seed hex:', mnenonicSeedHex)

// Mnemonic to seed sync
const seedHex = bip39.mnemonicToSeedSync('basket actual').toString('hex')
console.log('Seed hex:', seedHex)

const seedBuffer = bip39.mnemonicToSeedSync('basket actual')
console.log('Seed buffer:', seedBuffer)

// Mnemonic to seed async
bip39.mnemonicToSeed('basket actual').then(bytes => {
  console.log('Async seed buffer:', bytes)
})

bip39.mnemonicToSeed('basket actual').then(bytes => bytes.toString('hex')).then(hex => {
  console.log('Async seed hex:', hex)
})

// Validate mnemonic
console.log('Validate valid mnemonic:', bip39.validateMnemonic(mnemonic))
console.log('Validate invalid mnemonic:', bip39.validateMnemonic('basket actual'))
