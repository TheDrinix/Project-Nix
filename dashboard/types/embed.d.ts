export interface Embed {
  color: number
  title?: string
  titleUrl?: string
  author?: EmbedAuthor
  description?: string
  thumbnail?: EmbedThumbnail
  fields: EmbedField[]
  image?: EmbedImage
  timestamp?: string
  footer?: EmbedFooter
}

export interface EmbedAuthor {
  name?: string
  iconUrl?: string
}

export interface EmbedThumbnail {
  url?: string
}

export interface EmbedField {
  name?: string
  value?: string
  inline?: boolean
}

export interface EmbedImage {
  url?: string
}

export interface EmbedFooter {
  text?: string
  iconUrl?: string
}
