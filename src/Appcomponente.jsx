import React, { useEffect, useState } from "react";
import "./Appcomponente.css"; //importo el css para que me tome los cambios.
// import { useEffect } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";


const Appcomponente = () => {
  const [photos, setPhotos] = useState([]); //Aca tengo mi array vacio porque estamos seteando a toda la informacion de mi API.A medida que cambia mi imput, va a traerme otro array, es por eso tambien que lo seteamos.
  const [valor, setValor] = useState(""); //Conexion para poder capturar el valor que el usuario escriba.
  const [page, setPage] = useState(1); //Para que vaya sumando una pagina a medida que scrolleo
  const [loading, setLoading] = useState(false);

  const apiKey = "FlleJZCiIU9cEQG5R2jgv0erCcDhETdPi6ICYBYJ8OY";
  // useEffect(() => {
  //   photosAleatorias();
  // }, []);

  // const photosAleatorias = async () => {
  //   const urlPhotos = `https://api.unsplash.com/photos/?client_id=n0c6NkXb4aSv0akhByXbyv-HJl1KkAVv8voqpdL4cFc&per_page=30`;

  //   const response = await fetch(urlPhotos);
  //   const data = await response.json();
  //   setPhotos(data);

  // };

  //   useEffect(() => {
  //   const photosAleatorias_scroll = async () => {
  //     const urlPhotos = `https://api.unsplash.com/photos/?client_id=n0c6NkXb4aSv0akhByXbyv-HJl1KkAVv8voqpdL4cFc&per_page=30&page=${page}`;

  //     const response = await fetch(urlPhotos);
  //     const data = await response.json();
  //     setPhotos(data);
  //     setPhotos((datosPrevios)=>datosPrevios.concat(data))
  //     console.log(data);
  //   };
  //   // photosAleatorias_scroll()
  // }, [page]);//Aca con el useEffect hago que cuando scroleo me tome los datos previos del principio y me los sume , ya que estoy seteando a page

  // useEffect(() => {
  //     const photosAleatorias= async () => {
  //         const urlPhotos=`https://api.unsplash.com/photos/?client_id=n0c6NkXb4aSv0akhByXbyv-HJl1KkAVv8voqpdL4cFc&per_page=30`

  //         const response= await fetch(urlPhotos)
  //         const data=await response.json();
  //         setPhotos(data)
  //     console.log(data)

  //     }
  //     photosAleatorias()
  //     }, []);
  const handleClickSearch = async (tag) => {
    if(tag){
      setValor(tag)
    }
    setPhotos([]);
    setPage(-1); //cuando le asigno este valor , vuelve a ejecutar obtener personajes. a la segunda vez que apretabamos search no buscaba nada, ya que no detectaba cambio de estado en la variable page. ya que la funcion se ejecuta cuando cambia de estado. que arranque en -1 , lo cual detecta cambio  ejecute la funcion. y dentro de la misma si el valor de pagina es -1 , lo forzamos a 0. asi tambien funciona el paginado. ya que traia dos veces lo mismo.
  };

  const obtenerPersonajes = async () => {
    //const apiKey = "n0c6NkXb4aSv0akhByXbyv-HJl1KkAVv8voqpdL4cFc"; //codigo de acceso a la url de la API.
    // const api= valor=="" ? "https://api.unsplash.com/photos" : "https://api.unsplash.com/search/photos"
    // const url = `${api}?client_id=${apiKey}&query=${valor}&per_page=30&page=${page}`;
    // Esto es la url base para acceder , mediante mi codigo de acceso.
    setLoading(true);

    const query =
      valor == ""
        ? `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=5&page=${page}`
        : `https://api.unsplash.com/photos/random?client_id=${apiKey}&query=${valor}&count=5&page=${page}`;
    // const url=`https://api.unsplash.com/photos/random?client_id=${apiKey}${query}&count=30&page=${page}`
    const url = `${query}`;

    try {
      const response = await fetch(url); //fetch me trae la API a mi js. El response me trae toda la info de la API.
      const data = await response.json(); //Response.json me convierte de json a array de objetos.
      // const listPhotos=valor=="" ? data : data.results

      if (page == -1) {
        setPage(0);
      }

      let arr = []; // Por cada foto del array buscamos en la API el tag y se lo agregamos al objeto photo
      // setLoading(true);
      for await (const elemento of data) {
        // Este for espera a los await que yo ponga para que recopile toda la info.Esto recorriendo mi array.
        let tags = await getTags(elemento.id);// Await hace que espere a terminsarse la funcion y que me devuelva algo.
        arr.push({ ...elemento, tags }); //aca pusheo los tags que son los que consigo en la variable let tags ya que ejecuto mi funcion. estoy agragando esa propiedad a mi objeto.
      }
      setPhotos((datosPrevios) => datosPrevios.concat(arr)); //Que cuando se renderice mi pagina me traiga los resultados/informacion de mi API que yo solicite en el buscador.Modifica el estado de las fotos al setearla.
      setLoading(false);
      // console.log(data); //aca me trae el array de objetos completo.
    } catch (error) {
      console.log(
        "🚀 ~ file: Appcomponente.jsx:94 ~ obtenerPersonajes ~ error:",
        error
      );
    }
  }; //Aca en la funcion hago que se me ejecuten las imagenes que pido

  useEffect(() => {
    if (page != 0) {
      //Esta condicion hablita a que busque unicamente si aprieta en el boton buscar o si scrolea.
      obtenerPersonajes();
    }
  }, [page]); //Aca la funcion metida en el useEffect es para que cuando scroleo se setee a otra pagina y me sume esos datos con los nuevos.cuando cambia de valor la variable page(cuando scroleo)

  const getTags = async (id) => {
    const url = `https://api.unsplash.com/photos/${id}?client_id=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      let tags = [];

      data.tags_preview.forEach((el) => {
        tags.push(el.title);
      });
      return tags;
    } catch (error) {}
  };
  // useEffect(() => {
  //     filtrador()
  //     }, [valor]);

  // const filtrador = (value) =>{
  // console.log(value)
  // setValor(data)
  // setPhotos(photos.filter(elemento => elemento.photos.includes(value)))
  // }
  return (
    <>
      {" "}
      {/* Fragmente porque no puedo tener dos div padres  */}
      <div>
        <div className="contenedor">
          <input
            className="buscador"
            type="text"
            placeholder="Search images"
            onChange={(e) => setValor(e.target.value)}
          />{" "}
          {/* El atributo onChange(funcion anonima que le paso el evento) me sirve para capturar lo que el cliente esta buscando. A el 'e' (evento) se lo paso a mi estado setValor, para que mi pagina cambie y e traiga lo que el usuario escriba (valor que se asigne). El value va cambiando a medida que el usuario escriba*/}
          <button className="search" onClick={() => handleClickSearch()}>Search
          
          </button>
          {/* Aca cada vez que cliqueo se va a ejecutar esa funcion, es decir, lo que yo solicito, esto se logra mediante el value del input y cuando cliqueo el boton , esta todo conectado */}
        </div>
      </div>
      <InfiniteScroll
        dataLength={photos.length}
        hasMore={true}
        next={() => setPage(page + 1)}
        loader={loading && <h1>Loading...</h1>}
        // Si loading es true mostrame h1
      >
        <div className="contenedor-imagenes">
          {photos.map((elemento, indice) => {
            console.log(elemento)
            return (
              <div>
                <div className="contenedor-imagen">
                  <img
                    className="imagenes"
                    key={elemento.id}
                    src={elemento.urls.regular}
                  />{" "}
                  {/* Esto es para que me retorne por cada elemento la url. El key (indice) es la posicion unica de cada elemento de mi array  */}
                </div>

                <div className="details">
                <h2 className="descripciones">{elemento.alt_description}</h2>
                <h2 className="descripciones" id="desc">
                  Ubicacion:{" "}
                  {elemento.user.location === null
                    ? "Unspecified"
                    : elemento.user.location}
                </h2>
                <h2 className="descripciones">
                  Camera:{" "}
                  {elemento.exif.name === null
                    ? "Unspecified"
                    : elemento.exif.name}
                </h2>
                {/* <h2 className="descripciones">{(getTags(elemento.id))}</h2> */}

                {/* <h2 className="descripciones">Tags: {`${elemento.tags}`}</h2> */}
                {/* Esta entre dobles llaves porque esta llamando una variable */}
                <h2 className="descripciones"> {
                   elemento.tags.map((tag) => {
                    return(
                
                    <div className="tags" onClick={()=> handleClickSearch(tag)}>{`${tag}`}</div>
          )})}</h2>

          </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </>
  );
};

export { Appcomponente };
