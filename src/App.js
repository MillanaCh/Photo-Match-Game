import { useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import "./App.css";

const URL = "https://api.unsplash.com/photos/?client_id=";
const KEY = "K-4FGgVqQa8c_jcbQEfbznmmROHLvVtLv75JXNpRTZI";

function App() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null)
  const [reset, setReset] = useState(false)

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

      data = data.map((image) => {
        return { ...image, unique: nanoid() };
      });
      setPhotos(data);

      const shuffle = (arr) => {
        for(let i = 0; i < arr.length; i++){
          let random = Math.floor(Math.random() * arr.length)
          let storingRandom = arr[random]
          arr[random] = arr[i] //put tp place of random the rendering one
          arr[i] = storingRandom //put to render one the random photo
        }
        return arr
      }
      setPhotos(shuffle(data))
    } catch (err) {
      console.log(err);
    }
  };

  const handlerClick = (unique) => {
    const foundIndex = photos.findIndex((photo) => photo.unique === unique)
    let copyOfPhoto = {...photos}
    copyOfPhoto[foundIndex].showThisPhoto = true //add new key to obj
    setPhotos(copyOfPhoto)
    // console.log(photos[foundIndex])
    // console.log(photos[index])
    if(selected === null){
      setSelected(unique)
      return
    } else {
        if(copyOfPhoto[unique].unique === copyOfPhoto[selected].unique){
           return
        } else {
        //if photo different make showPhoto to false
           if(copyOfPhoto[unique].id !== copyOfPhoto[selected].id){
            setTimeout(() => {
            copyOfPhoto[unique].showThisPhoto = false
            copyOfPhoto[selected].showThisPhoto = false
            setPhotos(copyOfPhoto)
            setSelected(null)
          }, 500)
          } else {
           setSelected(null)
          }
      }
      // copyOfPhoto[unique] //photo that was just cliked
      // copyOfPhoto[selected]//photo that was clicked before
    }
  }

  useEffect(() => {
    fetchingFromServer();
  }, [reset]);

  return (
    <div className="App">
      {photos.map((photo, index) => {
        return (
          //use jsx
          <div className="card" key={photo.unique} onClick={() => handlerClick(photo.unique)}>
            <img src={photo.urls.thumb} alt={photo.alt_description} className={photo.showThisPhoto ? "show" : "notShow"} />
          </div>
        );
      })}
      <button onClick={() => setReset(!reset)} className="btn">Reset</button>
    </div>
  );
}

export default App;
