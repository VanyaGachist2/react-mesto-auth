import logo from '../images/logo.svg';

function Header () {
  return (
    <header className="header">
        <img className="header__logo" alt="Россия" src={logo} />
        <div className='header__log'>
            <p className='header__mail'>tornadoz-2003@mail.ru</p>
            <p className='header__condition'>Выйти</p>
          </div>
    </header>
  )
}

export default Header;
