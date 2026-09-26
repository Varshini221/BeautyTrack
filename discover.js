const API = "http://127.0.0.1:5001"; 

async function showPlaces(){
    const service = document.getElementById("service").value;
    const radius = document.getElementById("distance").value;

    if (!service || !radius) {
        alert("please fill in all fields");
        return;
    }

    navigator.geolocation.getCurrentPosition( async function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try{
            const response = await fetch(`${API}/nearby?service=${service}&lat=${lat}&lng=${lng}&radius=${radius}`);

            if (!response.ok) {
                throw new Error("Failed to get places")
            }

            const places = await response.json();
            console.log(places); // add this line
            const container = document.getElementById("nearby-businesses");

            container.innerHTML = ""

            places.forEach(place => {
                const placeElement = document.createElement("div");
                placeElement.className = "business-card";

                placeElement.innerHTML = `
                    <div class = "details">
                        <strong>${place.name}</strong>
                        <span>${place.address}</span>
                        <span>${place.rating} ⭐ </span>
                    </div>
                `;

                container.appendChild(placeElement);
            });

            } catch(error) {
                console.error(error);
            }
    });
    
}