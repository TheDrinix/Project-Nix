export interface Embed {
  color: number
  title?: string
  url?: string
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
  icon_url?: string
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
  icon_url?: string
}
