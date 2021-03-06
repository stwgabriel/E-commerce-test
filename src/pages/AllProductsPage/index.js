import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../../contexts/CartContext';

import CartModal from './components/CartModal';
import Product from './components/Product';
import {
  PageContainer, Header, ProductsContainer,
} from './styles';

import frexcoLogo from '../../assets/images/logo-frexco.png';
import cartIcon from '../../assets/images/icons/cart.svg';
import Loader from '../../components/Loader';

function AllProductsPage() {

  const [renderCartModal, setRenderCartModal] = useState(false);
  const [renderLoader, setRenderLoader] = useState(true);
  const [pageItems, setPageItems] = useState([]);

  function handleRenderCartModal() {

    setRenderCartModal(!renderCartModal);
  }

  const { handleItemAddition, cartLength } = useContext(CartContext);

  useEffect(() => {

    setRenderLoader(true);
    axios.get('https://empresas.frexco.com.br/api/product/public')
      .then((companyData) => {

        if (companyData.status < 200 || companyData.status >= 300) { throw new Error(); }
        setPageItems(() => (
          companyData.data.map((item) => ({ ...item, selectedAmount: 1 }))
        ));
      })
      .catch((error) => {

        throw new Error('Fetch ERROR:', error);
      })
      .finally(() => { setRenderLoader(false); });
  }, []);

  return (

    <PageContainer>
      <CartModal
        renderModal={renderCartModal}
        handleRenderModal={() => { handleRenderCartModal(); }}
      />
      <Loader renderLoader={renderLoader} />
      <Header>

        <h1 id="logo-frexco">
          <img src={frexcoLogo} alt="Frexco" />
        </h1>

        <menu className="left-menu">

          <button
            type="button"
            id="cart"
            onClick={handleRenderCartModal}
          >
            <img src={cartIcon} alt="cart" />

            {cartLength !== 0 && (
              <div className="cart-count">{cartLength}</div>
            )}

          </button>

          <div className="sign-buttons">
            <a href="/#">Entrar</a>
            <span>/</span>
            <a href="/#">Cadastrar</a>
          </div>
        </menu>

      </Header>

      <ProductsContainer>

        {pageItems.map(({
          id, imageUrl, name, price, portion, individualPrice, selectedAmount,
        }) => (
          <Product
            id={id}
            key={id}
            itemImage={imageUrl}
            itemName={name}
            itemPrice={price}
            itemPortion={portion}
            individualPrice={individualPrice}
            selectedAmount={selectedAmount}
            handleItemAddition={handleItemAddition}
          />
        ))}
      </ProductsContainer>

    </PageContainer>
  );
}

export default AllProductsPage;
