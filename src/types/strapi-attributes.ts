export interface CatalogueData {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  coverImage: ImageData;
  keyImage?: ImageData;
  secondaryImages?: ImageData[];
  musicVideo?: {
    src: string;
    alt: string;
  };
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

export interface CatalogueAPI {
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
      data: ImageAPI;
    };
    key_image: {
      data: ImageAPI;
    };
    secondary_images?: {
      data: ImageAPI[];
    };
    music_video_clip?: {
      data: VideoAPI;
    };
  };
}

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  collection?: string;
  short_description: string;
  long_desription: string;
  price: number;
  price_original?: number;
  in_stock: boolean;
  image: ImageData;
  variants?: VariantGroupData[];  
}

export interface ProductAPI {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    name: string;
    slug: string;
    short_description: string;
    long_description: string;
    price: number;
    price_original: number;
    collection?: string;
    product_image: ImageAPI;
    variants?: VariantGroupAPI[];
  };
}

export interface ImageAPI {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    formats: {
      url: string;
      width: number;
    }[];
  };
}

export interface ImageData {
  src: string;
  width: number;
  alt: string;
}

export interface VideoAPI {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
  };
}

export interface VariantGroupAPI {
  id: string;
  variant_type: string;
  variant: VariantAPI[];
}

export interface VariantAPI {
  id: string;
  variant_name: string;
  price_differential: number;
}

export interface VariantGroupData {
  id: string;
  variant_type: string;
  variant_string?: string;
  variant: VariantData[];
}

export interface VariantData {
  id: string;
  variant_name: string;
  price_differential: number;
  enabled?: boolean;
}

export interface EventData {
  id: number;
  city: string;
  city_indigenous: string;
  venue: string;
  date_time: string;
  expired: boolean;
  ticket_link: string;
}

export interface EventAPI {
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
  };
}

export interface ProductsSnipcartAPI {
  items: {
    userDefinedId: string;
    totalStock: number;
    customFields: {
      name: string;
      type: string;
      options: string;
      required: boolean;
    }[];
    variants: {
      stock: number;
      variation: {
        name: string;
        option: string;
      }[];
      allowOutOfStockPurchases: boolean;
    }[];
  }[];
}