import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import type { WordCount, MnemonicValidation } from '../types/bip39'

/**
 * BIP39助记词管理的可复用组合式函数
 * 提供助记词生成、验证、转换和候选词获取功能
 */
export function useBip39() {
  /**
   * 生成BIP39助记词
   * @param wordCount - 助记词单词数量，12或24
   * @returns 生成的助记词字符串（空格分隔）
   * @throws {Error} 如果 wordCount 不是 12 或 24
   * @example
   * const mnemonic = generateMnemonic(12)
   * // "abandon ability able about above absent absorb abstract absurd abuse access accident"
   * 
   * 验证: 需求 1.1, 1.5
   */
  const generateMnemonic = (wordCount: WordCount = 12): string => {
    if (wordCount !== 12 && wordCount !== 24) {
      throw new Error('Word count must be 12 or 24')
    }
    const strength = wordCount === 12 ? 128 : 256
    return bip39.generateMnemonic(wordlist, strength)
  }

  /**
   * 验证BIP39助记词的有效性
   * @param mnemonic - 助记词字符串（空格分隔）
   * @returns 助记词是否有效
   * @example
   * validateMnemonic("abandon ability able about above absent absorb abstract absurd abuse access accident")
   * // true
   * 
   * 验证: 需求 1.3, 2.8
   */
  const validateMnemonic = (mnemonic: string): boolean => {
    if (!mnemonic || typeof mnemonic !== 'string') {
      return false
    }
    return bip39.validateMnemonic(mnemonic, wordlist)
  }

  /**
   * 将BIP39助记词转换为熵（十六进制字符串）
   * @param mnemonic - 助记词字符串（空格分隔）
   * @returns 熵的十六进制表示
   * @throws {Error} 如果助记词无效
   * @example
   * const entropy = mnemonicToEntropy("abandon ability able...")
   * // "00000000000000000000000000000000"
   * 
   * 验证: 需求 1.5
   */
  const mnemonicToEntropy = (mnemonic: string): string => {
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic')
    }
    const entropy = bip39.mnemonicToEntropy(mnemonic, wordlist)
    return Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * 将熵转换为BIP39助记词
   * @param entropy - 熵的十六进制字符串
   * @returns 助记词字符串（空格分隔）
   * @throws {Error} 如果熵无效
   * @example
   * const mnemonic = entropyToMnemonic("00000000000000000000000000000000")
   * // "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
   * 
   * 验证: 需求 1.5
   */
  const entropyToMnemonic = (entropy: string): string => {
    if (!entropy || typeof entropy !== 'string') {
      throw new Error('Invalid entropy')
    }
    const matches = entropy.match(/.{1,2}/g)
    if (!matches) {
      throw new Error('Invalid entropy format')
    }
    const entropyUint8 = new Uint8Array(matches.map(byte => parseInt(byte, 16)))
    return bip39.entropyToMnemonic(entropyUint8, wordlist)
  }

  /**
   * 根据输入前缀获取候选词列表
   * @param input - 输入的前缀字符串
   * @param limit - 返回的最大候选词数量，默认8
   * @returns 匹配的候选词数组
   * @example
   * getSuggestions("aba", 5)
   * // ["abandon"]
   * 
   * 验证: 需求 2.1
   */
  const getSuggestions = (input: string, limit: number = 8): string[] => {
    if (!input || typeof input !== 'string') {
      return []
    }
    
    const normalizedInput = input.toLowerCase().trim()
    if (!normalizedInput) {
      return []
    }

    return wordlist
      .filter(word => word.startsWith(normalizedInput))
      .slice(0, limit)
  }

  /**
   * 检查单词是否在BIP39词表中
   * @param word - 要检查的单词
   * @returns 单词是否在词表中
   * @example
   * isWordInWordlist("abandon")  // true
   * isWordInWordlist("invalid")  // false
   * 
   * 验证: 需求 2.8
   */
  const isWordInWordlist = (word: string): boolean => {
    if (!word || typeof word !== 'string') {
      return false
    }
    return wordlist.includes(word.toLowerCase().trim())
  }

  /**
   * 检查输入前缀是否有效（是否存在以该前缀开头的单词）
   * @param input - 输入的前缀字符串
   * @returns 前缀是否有效
   * @example
   * isValidPrefix("aba")  // true
   * isValidPrefix("xyz")  // false
   * 
   * 验证: 需求 2.5, 2.6
   */
  const isValidPrefix = (input: string): boolean => {
    if (!input || typeof input !== 'string') {
      return false
    }
    
    const normalizedInput = input.toLowerCase().trim()
    if (!normalizedInput) {
      return false
    }

    return wordlist.some(word => word.startsWith(normalizedInput))
  }

  /**
   * 清理和标准化输入文本
   * 移除非字母字符，转换为小写
   * @param input - 原始输入文本
   * @returns 清理后的文本
   * @example
   * normalizeInput("Aba123ndon!@#")  // "abandon"
   * 
   * 验证: 需求 2.9
   */
  const normalizeInput = (input: string): string => {
    if (!input || typeof input !== 'string') {
      return ''
    }
    return input.replace(/[^a-zA-Z]/g, '').toLowerCase()
  }

  /**
   * 从文本中解析助记词
   * 支持空格、换行等分隔符
   * @param text - 包含助记词的文本
   * @returns 解析出的单词数组
   * @example
   * parseMnemonicFromText("abandon  ability\n\nable")
   * // ["abandon", "ability", "able"]
   * 
   * 验证: 需求 4.1, 4.2
   */
  const parseMnemonicFromText = (text: string): string[] => {
    if (!text || typeof text !== 'string') {
      return []
    }
    return text.trim().split(/\s+/).filter(word => word.length > 0)
  }

  /**
   * 验证助记词数组的有效性
   * 检查单词数量和每个单词是否在词表中
   * @param words - 单词数组
   * @param expectedCount - 期望的单词数量（12或24）
   * @returns 验证结果对象，包含 isValid 和 errors
   * @example
   * validateMnemonicArray(["abandon", "ability"], 12)
   * // { isValid: false, errors: ["助记词数量应为12个，实际为2个"] }
   * 
   * 验证: 需求 4.3, 4.4
   */
  const validateMnemonicArray = (
    words: string[], 
    expectedCount: WordCount = 12
  ): MnemonicValidation => {
    const errors: string[] = []

    if (!Array.isArray(words)) {
      errors.push('助记词必须是数组')
      return { isValid: false, errors }
    }

    if (words.length !== expectedCount) {
      errors.push(`助记词数量应为${expectedCount}个，实际为${words.length}个`)
    }

    const invalidWords = words.filter(word => !isWordInWordlist(word))
    if (invalidWords.length > 0) {
      errors.push(`以下单词不在词表中: ${invalidWords.join(', ')}`)
    }

    const mnemonic = words.join(' ')
    if (words.length === expectedCount && invalidWords.length === 0) {
      if (!validateMnemonic(mnemonic)) {
        errors.push('助记词校验和无效')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 获取BIP39词表
   * @returns 完整的BIP39英文词表（2048个单词）
   * @example
   * const wordlist = getWordlist()
   * // ["abandon", "ability", "able", ...]
   * 
   * 验证: 需求 1.4
   */
  const getWordlist = (): string[] => {
    return wordlist
  }

  return {
    // 核心功能
    generateMnemonic,
    validateMnemonic,
    mnemonicToEntropy,
    entropyToMnemonic,
    
    // 候选词和验证
    getSuggestions,
    isWordInWordlist,
    isValidPrefix,
    
    // 工具函数
    normalizeInput,
    parseMnemonicFromText,
    validateMnemonicArray,
    getWordlist
  }
}

/**
 * useBip39 返回类型
 */
export type UseBip39Return = ReturnType<typeof useBip39>
