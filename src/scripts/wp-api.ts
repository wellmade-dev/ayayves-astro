import type {
  ImageStrapiApi,
  StrapiImageFormats,
  ProductApiData,
  CatalogueApiData,
  ImageAttributes,
} from '../types/strapi-attributes';

const STRAPI_API_URL = import.meta.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
const STRAPI_URL = import.meta.env.STRAPI_URL;

// Set up Strapi Auth Headers
const strapiHeaders = {
 "Authorization" : `Bearer ${STRAPI_API_TOKEN}`
}

// Set up dataCache Map
const dataCache = new Map();

export async function fetchStrapiData(query: string) {
  // Check if the data is already in the cache
  if (dataCache.has(query)) {
    return dataCache.get(query);
  }

  // If not in cache, fetch from the API
  const response = await fetch(`${STRAPI_API_URL}${query}`, {
    headers: strapiHeaders,
  });
  const data = await response.json();

  // Store the fetched data in the cache
  dataCache.set(query, data);

  return data;
}

export function createImageObject(object: any) {
  const { attributes = object.data?.attributes } = object;
  const srcset = createSrcset(attributes.formats);
  let altText;

  if (attributes.alternativeText) {
    altText = attributes.alternativeText;
  } else {
    altText = ''
  };

  const image = {
    src: STRAPI_URL + attributes.url,
    srcset: srcset,
    alt: altText
  }

  return image;
}

export function createSrcset(formats: StrapiImageFormats): string {
  const srcsetComponents = Object.entries(formats).map(([key, { url, width }]) => {
    return `${STRAPI_URL}${url} ${width}w`;
  });

  return srcsetComponents.join(", ");
}

export async function fetchProducts() {
  const response = await fetchStrapiData(
  "products?populate=product_image,variant"
  );
  const data: ProductApiData[] = response.data
  const products = data.map(product => createProductObject(product));

  return products
}

export function createProductObject(object: ProductApiData) {
  const product = {
    id: object.id,
    name: object.attributes.name,
    slug: object.attributes.slug,
    collection: object.attributes.collection,
    short_description: object.attributes.short_description,
    long_desription: object.attributes.long_description,
    price: object.attributes.price,
    markdown_price: object.attributes.markdown_price,
    inventory_quantity: object.attributes.inventory_quantity,
    variants: object.attributes.variant,
    image: createImageObject(object.attributes.product_image)
  }

  return product
}
 
export async function fetchCatalogue() {
  const response = await fetchStrapiData(
  "catalogue?populate=*&sort=release_date:desc"
  );
  const data: CatalogueApiData[] = response.data
  const catalogue = data.map(release => createReleaseObject(release));

  return catalogue
}

export function createReleaseObject(object: CatalogueApiData) {
  const attributes = object.attributes;
  const currentDate = new Date().getTime();
  const releaseDate = new Date(object.attributes.release_date).getTime();
  let presaveLive;
  if (object.attributes.presave_date) {
    const presaveDate = new Date(object.attributes.presave_date).getTime();
    presaveLive = (currentDate > presaveDate);
  }
  let secondaryImages: ImageAttributes[] = [];
  if (attributes.secondary_images && attributes.secondary_images.data) {
    secondaryImages = attributes.secondary_images.data.map(image => createImageObject(image));
  }

  const release = {
    id: object.id,
    title: attributes.title,
    slug: attributes.slug,
    subtitle: attributes.subtitle,
    coverImage: createImageObject(attributes.cover_image),
    keyImage: createImageObject(attributes.key_image),
    secondaryImages: secondaryImages,
    musicVideo: null,
    releaseType: attributes.release_type,
    released: currentDate > releaseDate,
    releaseDate: attributes.release_date,
    presaveDate: attributes.presave_date,
    presaveLive: presaveLive,
    presaveLink: attributes.presave_link,
    spotifylink: attributes.spotify_link,
    applemusicLink: attributes.applemusic_link,
    youtubeLink: attributes.youtube_link
  };

  return release
}

