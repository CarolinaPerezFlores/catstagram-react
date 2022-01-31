import React, { useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import CatstagramLogo from '../assets/imgs/catstagram.png';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';

const axios = require('axios');


function Home() {
  const [data, setData] = useState(
    {
      country_flag_url: "",
      images: [],
      breeds: [],
      selected_breed: "",
      current_image: {},
    }
  );

  const [headerBreeds, setHeaderBreeds] = useState([]);
  const [selectedCat, setSelectedCat] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (data.breeds.length <= 0) && getBreeds();
    (data.images.length === 0) && getImages('');
    data.breeds.length > 0 && sortImagesHeader();
  }, [data.breeds]);

  let getBreeds = async () => {
    try {
      axios.defaults.headers.common['795b1114-38d1-45da-8f3c-019934eb60c7'] = "DEMO-API-KEY" // Replace this with your API Key, as it's set to defaults it will be used from now onwards

      let response = await axios.get('https://api.thecatapi.com/v1/breeds/')
      let allBreeds = response.data;
      setData(prevState => ({
        ...prevState, breeds: allBreeds
      }))
      sortImagesHeader()

    } catch (err) {
      console.log(err)
    }
  }


  let hideModal = () => {
      setIsVisible(false);
  }

  const getImages = async (idImg) => {
    try {
      let strBreed = idImg;

      let query_params = {
        breed_id: strBreed,
        limit: 15
      }

      let response = await axios.get('https://api.thecatapi.com/v1/images/search', { params: query_params })

      let selectedB = data.selected_breed;
      if (selectedB !== idImg || selectedB === '') {
        let imagesData = response.data;
        setData(prevState => ({
          ...prevState, images: imagesData, selected_breed: idImg
        }))
      }

    } catch (err) {
      console.log(err)
    }
  }

  const sortImagesHeader = async (val) => {

    let nuberOfitemsToSet = 5;
    let lengthNumber = data.breeds.length;
    let arrBreedsHeader = [];

    for (let i = 0; i <= nuberOfitemsToSet; i++) {
      let numberRandom = randomNumber(0, lengthNumber);
      if (data.breeds.length > 0 && numberRandom <= data.breeds.length) {
      
        const elementObjet = data.breeds[numberRandom] && {
          name: data.breeds[numberRandom].name,
          url: data.breeds[numberRandom].image.url,
          id: data.breeds[numberRandom].id,

        };
      

        if (headerBreeds.length < nuberOfitemsToSet) {
          arrBreedsHeader.push(elementObjet);

        }
      

        if (arrBreedsHeader.length === nuberOfitemsToSet + 1) {
          setHeaderBreeds(arrBreedsHeader);
        }
      }


    }
  }


  const randomNumber = (minimo, maximo) => {
    return Math.floor(Math.random() * ((maximo + 1) - minimo) + minimo);
  }

  let imageClick = (image) => {
    let name = (image.breeds.length !== 0) ? (image.breeds[0].name) : '';
    let url = (image.url) ? image.url : '';
    let desccription = (image.breeds.length !== 0) ? image.breeds[0].description : 'No information available at the moment, we are working on it :)';
    setSelectedCat({
      name: name,
      url: url,
      desccription: desccription
    })
    if (selectedCat) {
      setIsVisible(true)
    }

  }


  return (
    <div className="mb-10">
      <Menubar
        style={{background: '#004AAD'}}
        start={<Image src={CatstagramLogo} alt="catstagram" width='100' />}
        end={
          <Dropdown className='mr-5' optionLabel="name" optionValue="id" value={data.selected_breed} options={data.breeds} onChange={(e) => { setData((prevState) => ({ ...prevState, selected_breed: e.value })); getImages(e.value); }} placeholder="Select a Breed" />
        }
      />

      <div className="flex justify-center my-10">
      <Button label="Refresh" className="p-button-raised p-button-rounded" onClick={()=>{window.location.reload(false);}} />
      </div>

      <div>
        <div className="container grid justify-items-center md:grid-cols-6 sm:grid-cols-3 gap-10 w-4/5 mx-auto">
          {headerBreeds?.map((breed, index) => (
            <div key={index}>
            <div className="w-20 h-20 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {  getImages(breed.id)}}>
              <img src={breed.url} className=" object-cover min-w-full min-h-full" alt="catstagram" />
            </div>
            <p className="text-center">{breed.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container grid md:grid-cols-3 sm:grid-cols-1 gap-10 px-10 pt-20 mx-auto">
        {data.images?.map((image, index) => (
          <div key={index} className="w-100 h-60 rounded overflow-hidden" onClick={() => imageClick(image)} ><img className=" object-cover min-w-full min-h-full" src={image.url} alt="catstagram" /></div>
        ))}
      </div>

      <Dialog header={selectedCat.name}   visible={isVisible} style={{width: '50vw'}} modal onHide={hideModal}>
          <img className=" object-cover min-w-full min-h-full" src={selectedCat.url} alt="catstagram" />
          <p className="text-center mt-10">{selectedCat.desccription}</p>
      </Dialog>
    </div>
  );
}
export default Home;
