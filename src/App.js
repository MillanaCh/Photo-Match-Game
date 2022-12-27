import { useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import "./App.css";

const URL = "https://api.unsplash.com/photos/?client_id=";
const KEY = "K-4FGgVqQa8c_jcbQEfbznmmROHLvVtLv75JXNpRTZI";

function App() {
  const [photos, setPhotos] = useState([]);
  const fetchingFromServer = async () => {
    try {
      // const req = await fetch(URL+KEY+"&page=2")
      // const data = await req.json()
      // const response =await axios.get(URL+KEY+"&page=2")

      // const req2 = await fetch(URL+KEY+"&page=3")
      // const data2 = await req2.json()
      const [page1, page2] = await axios.all([
        axios.get(URL + KEY + "&page=2"),
        axios.get(URL + KEY + "&page=3"),
      ]);
      let data = [
        ...page1.data,
        ...page1.data,
        ...page2.data.slice(0, 2),
        ...page2.data.slice(0, 2),
      ];

      const shuffle = (arr) => {
        for(let i = 0; i < arr.length; i++){
          let random = Math.floor(Math.random() * arr.length)
          let storingRandom = arr[random]
          arr[random] = arr[i] //put tp place of random the rendering one
          arr[i] = storingRandom //put to render one the random photo
        }
        return arr
      }
      data = shuffle(data)
      setPhotos(data)

      data = data.map((image) => {
        return { image, unique: nanoid };
      });
      setPhotos(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchingFromServer();
  }, []);

  return (
    <div className="App">
      {photos.map((photo) => {
        return (
          //use jsx
          <div className="card" key={photo.unique}>
            <img src={photo.image.urls.thumb} alt={photo.image.alt_description} />
          </div>
        );
      })}
    </div>
  );
}

export default App;
