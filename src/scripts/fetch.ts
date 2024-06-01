import type {
	ProductAPI,
	CatalogueAPI,
	ImageData,
	EventAPI,
	ProductData,
	VariantGroupData,
	CatalogueData,
} from "../types/strapi-attributes";

import { format } from "date-fns";

const STRAPI_URL = import.meta.env.STRAPI_URL;
const PUBLIC_STRAPI_API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

// Set up Strapi Auth Headers
const strapiHeaders = {
	Authorization: `Bearer ${STRAPI_API_TOKEN}`,
};

// Set up dataCache Map
const dataCache = new Map();

export async function fetchStrapiData(query: string, bypassCache?: boolean) {
	// If bypassCache is true, wipe the cache
	if (bypassCache) {
		dataCache.clear();
	} else {
		// Check if the data is already in the cache
		if (dataCache.has(query)) {
			return dataCache.get(query);
		}
	}

	// If not in cache or bypassCache is true, fetch from the API
	const response = await fetch(`${PUBLIC_STRAPI_API_URL}${query}`, {
		headers: strapiHeaders,
	});
	const data = await response.json();

	// Store the fetched data in the cache only if bypassCache is not true
	if (!bypassCache) {
		dataCache.set(query, data);
	}

	return data;
}

export function createImageObject(object: any) {
	const { attributes = object.data?.attributes } = object;
	let altText;

	if (attributes.alternativeText) {
		altText = attributes.alternativeText;
	} else {
		altText = "";
	}

	let src;
	if (STRAPI_URL) {
		src = `${STRAPI_URL}${attributes.url}`;
	} else {
		src = attributes.url;
	}

	const image = {
		src: src,
		width: attributes.width,
		alt: altText,
	};

	return image;
}

export function createVideoObject(object: any) {
	const attributes = object.data.attributes;

	let src;
	if (STRAPI_URL) {
		src = `${STRAPI_URL}${attributes.url}`;
	} else {
		src = attributes.url;
	}

	const video = {
		src: src,
		alt: attributes.alternativeText ? attributes.alternativeText : "",
	};

	return video;
}

export async function fetchSingleTypeObject(
	singleType: string,
	field?: string
) {
	const data = await fetchStrapiData(`${singleType}?populate=*`);
	if (field) {
		const fieldValue = data.data.attributes[field];
		if (fieldValue.data) {
			return fieldValue;
		} else {
			return "Data was null, check to see if field has been set.";
		}
	} else {
		return data.data.attributes;
	}
}

export async function fetchPageMetaInformation(singleType: string) {
	const data = await fetchStrapiData(
		`${singleType}?populate[meta][populate]=image`
	);

	// Clean the image object
	const image = createImageObject(data.data.attributes.meta.image);

	const meta = {
		description: data.data.attributes.meta.description,
		imageURL: image.src,
	};
	return meta;
}

export async function fetchProducts() {
	const strapiResponse = await fetchStrapiData(
		"products?populate[0]=variants&populate=product_image&populate[1]=variants.variant"
	);
	const strapiData: ProductAPI[] = strapiResponse.data;

	const products = strapiData.map((product) => createProductObject(product));
	return products;
}

export function createProductObject(strapiProductData: ProductAPI) {
	let variantTypes: VariantGroupData[] | undefined =
		strapiProductData.attributes.variants;

	// Replace variantTypes array with copied array + variant_string for Snipcart
	if (variantTypes && variantTypes.length > 0) {
		// Create variant strings for Snipcart variants
		variantTypes = variantTypes.map((variantType) => {
			// Generate the variant string for the whole group
			const variantString = variantType.variant
				.map((variant) => {
					// Compute price differential string
					const priceDifferential = variant.price_differential
						? `[${variant.price_differential > 0 ? "+" : ""}${variant.price_differential}]`
						: "";

					// Return the formatted string for this variant
					return `${variant.variant_name}${priceDifferential}`;
				})
				.join("|"); // Join all variant strings in this group with '|'
			// Return the new variant group object with the variant_string attached
			return {
				...variantType,
				variant_string: variantString, // Attach the compiled string to the variantGroup
			};
		});
	}

	const product: ProductData = {
		id: strapiProductData.id,
		name: strapiProductData.attributes.name,
		slug: strapiProductData.attributes.slug,
		collection: strapiProductData.attributes.collection,
		short_description: strapiProductData.attributes.short_description,
		long_desription: strapiProductData.attributes.long_description,
		price: strapiProductData.attributes.price,
		price_original: strapiProductData.attributes.price_original,
		variants: variantTypes,
		image: createImageObject(strapiProductData.attributes.product_image),
	};

	return product;
}

export async function fetchCatalogue() {
	const response = await fetchStrapiData(
		"catalogue?populate=*&sort=release_date:desc"
	);
	const data: CatalogueAPI[] = response.data;
	const catalogue = data.map((release) => createReleaseObject(release));

	return catalogue;
}

export function createReleaseObject(object: CatalogueAPI) {
	const attributes = object.attributes;
	const currentDate = new Date().getTime();
	const releaseDate = new Date(object.attributes.release_date).getTime();
	let presaveLive;
	if (object.attributes.presave_date) {
		const presaveDate = new Date(object.attributes.presave_date).getTime();
		presaveLive = currentDate > presaveDate;
	}
	let secondaryImages: ImageData[] = [];
	if (attributes.secondary_images && attributes.secondary_images.data) {
		secondaryImages = attributes.secondary_images.data.map((image) =>
			createImageObject(image)
		);
	}

	const release: CatalogueData = {
		id: object.id,
		title: attributes.title,
		slug: attributes.slug,
		subtitle: attributes.subtitle,
		coverImage: createImageObject(attributes.cover_image),
		keyImage: attributes.key_image.data
			? createImageObject(attributes.key_image)
			: undefined,
		secondaryImages: secondaryImages,
		musicVideo: attributes.music_video_clip?.data
			? createVideoObject(attributes.music_video_clip)
			: undefined,
		releaseType: attributes.release_type,
		released: currentDate > releaseDate,
		releaseDate: releaseDate,
		releaseDatePretty: format(releaseDate, "MMM d, yyyy"),
		releaseMonth: format(releaseDate, "MMM yyyy"),
		presaveDate: attributes.presave_date,
		presaveLive: presaveLive,
		presaveLink: attributes.presave_link,
		spotifyLink: attributes.spotify_link,
		applemusicLink: attributes.applemusic_link,
		youtubeLink: attributes.youtube_link,
	};

	return release;
}

export async function fetchEvents() {
	const response = await fetchStrapiData(
		"events?populate=*&sort=date_time:desc"
	);
	const data: EventAPI[] = response.data;
	const events = data.map((event) => createEventObject(event));
	return events;
}

export function createEventObject(object: EventAPI) {
	let expired;
	const eventDate = new Date(object.attributes.date_time).getTime();

	if (object.attributes.date_time) {
		const currentDate = new Date().getTime();
		expired = currentDate > eventDate;
	}

	const formattedDate = format(eventDate, "EEE d MMM");

	const event = {
		id: object.id,
		city: object.attributes.city,
		city_indigenous: object.attributes.city_indigenous,
		venue: object.attributes.venue,
		date_time: formattedDate,
		expired: expired,
		ticket_link: object.attributes.ticket_link,
	};

	return event;
}
