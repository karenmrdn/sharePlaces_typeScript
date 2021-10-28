import axios from "axios";
// import * as dotenv from "dotenv";

// dotenv.config({ path: __dirname + "/.env" });
// dotenv.config();
const API_KEY = process.env.API_KEY;

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

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
      )}&key=${API_KEY}`
    );

    if (response.data.status !== "OK") {
      throw new Error("Could not fetch location.");
    }

    const coordinates = response.data.results[0].geometry.location;
  } catch (error) {
    console.error(error);
  }
};

form.addEventListener("submit", searchAddressHandler);
