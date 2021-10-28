// https://stackoverflow.com/questions/49375867/how-do-you-reference-a-process-env-variable-in-html-script-src-react/56984657

import axios from "axios";
// import * as dotenv from "dotenv";

// dotenv.config({ path: __dirname + "/.env" });
// dotenv.config();
const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEMAP_API_KEY}`;
document.head.append(script);

function initMap(coordinates: { lat: number; lng: number }): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: coordinates,
      zoom: 15,
    }
  );

  const marker = new google.maps.Marker({
    position: coordinates,
    map,
  });
}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status:
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_DAILY_LIMIT"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR";
};

const searchAddressHandler = async (event: Event) => {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  try {
    const response = await axios.get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLEMAP_API_KEY}`
    );

    if (response.data.status !== "OK") {
      throw new Error("Could not fetch location.");
    }

    const coordinates = response.data.results[0].geometry.location;
    console.log(coordinates);

    initMap(coordinates);
  } catch (error) {
    console.error(error);
  }
};

form.addEventListener("submit", searchAddressHandler);
