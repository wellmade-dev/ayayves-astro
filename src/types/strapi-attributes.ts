export interface CatalogueAttributes {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  coverImage: ImageAttributes;
  keyImage?: ImageAttributes;
  secondaryImages?: ImageAttributes[];
  musicVideo?: object;
  releaseType: string;
  released: boolean;
  releaseDate: string;
  presaveDate?: string;
  presaveLive?: boolean;
  presaveLink?: string;
  spotifyLink?: string;
  applemusicLink?: string;
  youtubeLink?: string;
}

export interface CatalogueApiData {
  id: number;
  attributes: {
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    release_type: string;
    release_date: string;
    presave_date?: string;
    music_video_date?: string;
    subtitle: string;
    presave_link?: string;
    spotify_link?: string;
    applemusic_link?: string;
    youtube_link?: string;
    cover_image: {
      data: ImageStrapiApi;
    },
    key_image: {
      data: ImageStrapiApi;
    },
    secondary_images?: {
      data: ImageStrapiApi[];
    },
    music_video_clip?: {
      data: VideoStrapiApi
    }
  }
}

export interface ProductAttributes {
  id: number;
  name: string;
  slug: string;
  collection: string;
  short_description: string;
  long_desription: string;
  price: number;
  markdown_price: number | null;
  inventory_quantity: number | null;
  variants: object;
  image: ImageAttributes
}

export interface ProductApiData {
  id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      short_description: string;
      long_description: string;
      price: number;
      markdown_price?: number;
      inventory_quantity?: number;
      collection?: string;
      slug: string;
      name: string;
      product_image: ImageStrapiApi;
      variant: VariantStrapiApi;
    }
}

export interface ImageStrapiApi {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    formats: StrapiImageFormats;
  }
}

export interface ImageAttributes {
  src: string;
  srcset: string;
  alt: string;
}

export interface StrapiImageFormats {
  url: string;
  width: number;
}

export interface VideoStrapiApi {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
  }
}

export interface VariantStrapiApi {
  id: number;
  variant_name: string;
  price?: number;
  markdown_price?: number;
  inventory_quantity: number;
}

export interface EventAttributes {
  id: number;
  city: string;
  city_indigenous: string;
  venue: string;
  date_time: string;
  expired: boolean;
  ticket_link: string;
}

export interface EventApiData {
  id: number;
    attributes: {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      city: string;
      city_indigenous: string;
      venue: string;
      date_time: string;
      ticket_link: string;
    }
}
