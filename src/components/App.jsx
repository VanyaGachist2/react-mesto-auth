import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import { api } from "../utils/Api.js";
import ImagePopup from "./ImagePopup.jsx";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import EditProfilePopup from './EditProfilePopup.jsx';
import EditAvatarPopup from "./EditAvatarPopup.jsx";
import AddCardPopup from "./AddCardPopup.jsx";

function App() {

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [userData, setUserData] = useState({})
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    api.getInfo()
      .then((data) => {
        setUserData(data)
      })
      .catch((err) => {
        console.log(err);
      });
    api.getCards()
      .then((data) => {
        setCards(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleOpenEditPopup = () => {
    setIsEditPopupOpen(true);
  }

  const handleOpenAddPopup = () => {
    setIsAddPopupOpen(true);
  }

  const handleOpenAvatarPopup = () => {
    setIsAvatarPopupOpen(true);
  }

  const handleOpenFullImageCard = useCallback((title, image) => {
    setSelectedCard({title, image})
  }, []);

  function closeAllPopups() {
    setIsAddPopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsEditPopupOpen(false);
    setSelectedCard(null);
  }


  function handleCardDelete (card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUptadeUserInfo(userData) {
    api.editProfile(userData.name, userData.about)
      .then((newUser) => {
        setUserData(newUser)
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatarForPage (data) {
    api.changeAvatar(data)
      .then((d) => {
        setUserData(d);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddCard (data) {
    api.addCard(data)
     .then((newCards) => {
      setCards((cards) => [newCards, ...cards]);
      closeAllPopups();
     })
     .catch((err) => {
      console.log(err);
     })
  }

  function  handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === userData._id);
    const checkLike = !isLiked ? api.addLiked(card._id) : api.deleteLike(card._id);
    checkLike
      .then((newCard) => {
        setCards((newCards) =>
          newCards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
      console.log(err);
      });
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={userData}>
        <EditProfilePopup isOpen={isEditPopupOpen} onClose={closeAllPopups} updateInfo={handleUptadeUserInfo} />
        <EditAvatarPopup isOpen={isAvatarPopupOpen} onClose={closeAllPopups} updateAvatar={handleUpdateAvatarForPage} />
        <AddCardPopup isOpen={isAddPopupOpen} onClose={closeAllPopups} addCard={handleAddCard} />
        <ImagePopup
          card={selectedCard}
          isClose={closeAllPopups}
        />
        <Header />
        <Main
          avatarPopup={handleOpenAvatarPopup}
          editPopup={handleOpenEditPopup}
          addPopup={handleOpenAddPopup}
          cards={cards}
          userData={userData}
          imagePopup={handleOpenFullImageCard}
          onDelete={handleCardDelete}
          onLike={handleCardLike}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
