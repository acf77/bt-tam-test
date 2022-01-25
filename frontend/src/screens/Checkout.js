import React, { useEffect } from "react";
import { Braintree, HostedField } from "react-braintree-fields";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Image,
} from "react-bootstrap";

import Loader from "../components/Loader";

import "../../src/App.css";

import camisa from "../../src/assets/camisa.jpg";

const Checkout = () => {
  const [tokenize, setTokenizeFunc] = React.useState();
  const [cardType, setCardType] = React.useState("");
  const [error, setError] = React.useState(null);
  const [token, setToken] = React.useState("");
  const [focusedFieldName, setFocusedField] = React.useState("");
  const [isDisplayed, setIsDisplayed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const numberField = React.useRef();
  const cvvField = React.useRef();
  const cardholderNameField = React.useRef();
  const navigate = useNavigate();

  const onAuthorizationSuccess = () => {
    numberField.current.focus();
  };

  const handleError = (newError) => {
    setError(newError.message || String(newError));
  };

  const onFieldBlur = (field, event) => setFocusedField("");
  const onFieldFocus = (field, event) => setFocusedField(event.emittedBy);

  const onCardTypeChange = ({ cards }) => {
    if (1 === cards.length) {
      const [card] = cards;

      setCardType(card.type);

      if (card.code && card.code.name) {
        cvvField.current.setPlaceholder(card.code.name);
      } else {
        cvvField.current.setPlaceholder("CVV");
      }
    } else {
      setCardType("");
      cvvField.current.setPlaceholder("CVV");
    }
  };

  const getToken = () => {
    tokenize()
      .then(setToken)
      .then(postToken)
      .then(setIsLoading(true))
      .then(redirect)
      .catch(handleError);
    //Go to index.js and remove React.Strict mode, for some reason, it fires two requests!
  };

  const postToken = useEffect(() => {
    async function postToken() {
      await fetch(
        "http://localhost:8080/token",

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: JSON.stringify(token.nonce),
        }
      );
    }
    postToken();
  }, [token.nonce]);

  const redirect = () =>
    setInterval(() => {
      setIsDisplayed(true);
    }, 8000);

  return (
    <Row>
      <Col>
        <ListGroup variant="flush">
          <ListGroupItem>
            <Image src={camisa} alt="" fluid />
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col>
        <ListGroup.Item xs lg="2">
          <h2 as="h3">Camisa Moto Clube de São Luís</h2>
        </ListGroup.Item>
        <ListGroup.Item>
          <h3>R$199.00</h3>
        </ListGroup.Item>
        <ListGroup.Item>
          Camisa do Maior time do Maranhão! O Moto Club de São Luís é uma
          agremiação esportiva brasileira da cidade de São Luís do Maranhão.
          Fundado em 13 de setembro de 1937, é um dos maiores e mais populares
          clubes do Estado do Maranhão. Sua sede está situada em São José de
          Ribamar, município da Região Metropolitana da capital maranhense.
        </ListGroup.Item>
        <Card class="card border-primary mb-3">
          <ListGroup sm={3}>
            <ListGroupItem>
              <Row sm={3}>
                <Col sm={3}>Price:</Col>
                <Col>
                  <strong>R$199,00</strong>
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row sm={3}>
                <Col sm={3}>Status:</Col>
                <Col>
                  <strong>10 in Stock</strong>
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <div className="flex-right">
                <Braintree
                  className="demo"
                  authorization="sandbox_rztdkhvd_65smb65yhv9ypytp"
                  onAuthorizationSuccess={onAuthorizationSuccess}
                  onError={handleError}
                  onCardTypeChange={onCardTypeChange}
                  getTokenRef={(ref) => setTokenizeFunc(() => ref)}
                  styles={{
                    input: {
                      "font-size": "12px",
                    },
                  }}
                >
                  <div>
                    Number:
                    <HostedField
                      type="number"
                      className={
                        "number" === focusedFieldName ? "focused" : "nofocus"
                      }
                      onBlur={onFieldBlur}
                      onFocus={onFieldFocus}
                      prefill="4111 1111 1111 1111"
                      ref={numberField}
                    />
                    Name:
                    <HostedField
                      type="cardholderName"
                      className={
                        "cardholderName" === focusedFieldName
                          ? "focused"
                          : "nofocus"
                      }
                      onBlur={onFieldBlur}
                      onFocus={onFieldFocus}
                      placeholder="Name on Card"
                      ref={cardholderNameField}
                    />
                    Expiration Date:
                    <HostedField
                      type="expirationDate"
                      onBlur={onFieldBlur}
                      onFocus={onFieldFocus}
                      className={
                        "expirationDate" === focusedFieldName
                          ? "focused"
                          : "nofocus"
                      }
                    />
                    CVV:
                    <HostedField
                      type="cvv"
                      placeholder="CVV"
                      ref={cvvField}
                      onBlur={onFieldBlur}
                      onFocus={onFieldFocus}
                      className={
                        "cvv" === focusedFieldName ? "focused" : "nofocus"
                      }
                    />
                    <div class="d-grid gap-2"></div>
                    {isDisplayed ? (
                      navigate("/success")
                    ) : isLoading ? (
                      <Loader />
                    ) : null}
                  </div>
                </Braintree>
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <button
                onClick={() => getToken()}
                class="btn btn-lg btn-primary"
                type="button"
              >
                Pay with <strong>{cardType}</strong> card
              </button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Checkout;
