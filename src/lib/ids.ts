// Excludes ambiguous characters (0/O, 1/I) so codes are easy to read aloud/write on a whiteboard.
const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateJoinCode(length = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)]
  }
  return code
}

export function membershipId(classId: string, userId: string): string {
  return `${classId}_${userId}`
}
