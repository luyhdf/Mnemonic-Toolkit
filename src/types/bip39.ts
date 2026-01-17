/**
 * BIP39 助记词单词数量类型
 */
export type WordCount = 12 | 24

/**
 * 助记词验证结果
 */
export interface MnemonicValidation {
  isValid: boolean
  errors: string[]
}

/**
 * 助记词状态
 */
export interface MnemonicState {
  words: string[]
  isValid: boolean
  wordCount: WordCount
}
