import styles from "./Avatar.module.css"

interface AvatarProps {
  name: string
}

function getInitials(name: string): string {
  const uppercaseLetters = name.match(/[A-Z]/g) ?? []
  if (uppercaseLetters.length >= 2) {
    return uppercaseLetters[0] + uppercaseLetters[1]
  }
  return name.charAt(0).toUpperCase()
}

export default function Avatar({ name }: AvatarProps) {
  const initials = getInitials(name)

  return (
    <div className={styles.avatar} role="img" aria-label={`${name} avatar`}>
      {initials}
    </div>
  )
}
