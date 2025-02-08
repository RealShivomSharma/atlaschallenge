from flask import Flask, jsonify
from geopy.geocoders import Nominatim
import requests
import time


app = Flask(__name__)


class Balloon:
    def __init__(self, latitude: float, longitude: float, altitude: float):
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude


def get_balloon_data(hours_before: str = "00"):
    # real time weather data
    url = f"https://a.windbornesystems.com/treasure/{hours_before}.json"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        balloons = []
        for entry in data:
            balloons.append(Balloon(entry[0], entry[1], entry[2]))

        # assuming that the balloons listed are the same

        # we can map the balloon number and save some sort of state for it
        # geolocator = Nominatim(user_agent="myGeocoder")
        # for balloon in balloons:
        #     location = geolocator.reverse(
        #         f"{balloon.latitude}, {balloon.longitude}", language="en"
        #     )
        #     try:
        #         print({"location": location.address})
        #     except Exception as e:
        #         print(e)

    #         return data

    except Exception as e:
        print("error fetching: ", e)
        return []


@app.route("/balloon-data")
def baloon_data():
    data = get_balloon_data()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
