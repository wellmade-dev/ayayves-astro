import { decode } from 'html-entities';

const WORDPRESS_API_URL = import.meta.env.WORDPRESS_API_URL;
const WORDPRESS_ACF_URL = import.meta.env.WORDPRESS_ACF_URL;

const username = 'wellmade'; // The username of the user
const appPassword = 'iX4s KoH2 t6rC XQn2 OsAl GCe2';

// Base64 encode the username and application password
const base64Credentials = btoa(`${username}:${appPassword}`);

const responseHeaders = {
  'Authorization': `Basic ${base64Credentials}`,
};

// Set up dataCache Map
const dataCache = new Map();

export async function fetchData(type) {
  // Check if the data is already in the cache
  if (dataCache.has(type)) {
    console.log("Type found")
    return dataCache.get(type);
  }

  // If not in cache, fetch from the API
  if (type === 'release') {
    console.log(`${WORDPRESS_API_URL}${type}/`);
    const response = await fetch(`${WORDPRESS_API_URL}${type}/`, {
      headers: responseHeaders,
    });
  const data = await response.json();
  return data;
  }

  // Store the fetched data in the cache
  dataCache.set(type, data);

  return data;
}

export async function fetchImageFromID(mediaIDs) {
  const promises = mediaIDs.map(async (mediaID) => {
    const response = await fetch(`${WORDPRESS_API_URL}media/${mediaID}`, {
      headers: responseHeaders,
    });
    const data = await response.json();

    const srcset = createSRCSET(data.media_details.sizes);

    return {
      src: data.source_url,
      alt: data.alt_text ? data.alt_text : "",
      srcset: srcset,
    };
  });
  return Promise.all(promises);
}

export function createSRCSET(sizes) {
  const srcsetComponents = [];

  Object.entries(sizes).forEach(([key, value]) => {
    // Handle flat object structure with direct URLs and corresponding widths
    if (typeof value === 'string' && !key.includes('woocommerce')) {
      const widthKey = `${key}-width`;
      const width = sizes[widthKey];
      if (width) {
        srcsetComponents.push(`${value} ${width}w`);
      }
    }
    // Handle nested object structure with 'source_url' and 'width' properties
    else if (typeof value === 'object' && value.hasOwnProperty('source_url') && value.hasOwnProperty('width')) {
      srcsetComponents.push(`${value.source_url} ${value.width}w`);
    }
  });

  return srcsetComponents.join(", ");
}



export function createReleaseObject(object) {
  const currentDate = new Date();
  const releaseDate = new Date(object.acf.release_date).getTime()

  const release = {
    title: decode(object.title.rendered),
    link: object.link,
    coverArt: {
      src: object.acf.cover_art.url,
      srcset: createSRCSET(object.acf.cover_art.sizes),
      alt: object.acf.cover_art.alt,
    },
    keyArt: {
      src: object.acf.key_art.url,
      srcset: createSRCSET(object.acf.key_art.sizes),
      alt: object.acf.key_art.alt,
    },
    videoLink: object.acf.raw_music_video_link,
    releaseType: object.acf.release_type,
    releaseDate: object.acf.release_date,
    presaveDate: object.acf.presave_date,
    released: currentDate > releaseDate,
    description: object.acf.short_description,
    presaveLink: object.acf.presave_link,
    spotifylink: object.acf.spotify_link,
    applemusicLink: object.acf.apple_music_link,
  };

  return release
}