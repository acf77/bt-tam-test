import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "../components/Loader";
import { Card, ListGroup, ListGroupItem, Col } from "react-bootstrap";

const Success = () => {
  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState();
  const [isError, setIsError] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fecthData = async () => {
      await axios
        .get("http://localhost:8080/success")
        .then(function (resp) {
          setResponse(resp.data);
          console.log(resp.data);
          setIsError(false);
          setIsLoading(false);
        })

        .catch(function (error) {
          setIsError(true);
          setError(error);
          console.log(error);
        });
    };
    fecthData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <h2>Your payment failed {error}</h2>
      ) : (
        <Col class="card align-items-center">
          <Card class="card align-items-center">
            <ListGroup>
              <h3>
                Success! Your payment was received!
                <i class="fa-solid fa-check"> </i>
              </h3>

              <ListGroupItem>
                <strong>Success Id: </strong>
                <a
                  href={`https://sandbox.braintreegateway.com/merchants/65smb65yhv9ypytp/transactions/${response.successId}/receipt/`}
                >
                  {response.successId}
                </a>
              </ListGroupItem>
              <ListGroupItem>
                <strong>Status: </strong>
                {response.status}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Amount paid: </strong>
                R${response.amount}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Buying date: </strong>
                {response.createdAt}
              </ListGroupItem>
              <ListGroupItem>
                <strong>Card type: </strong>
                {response.cardType}
              </ListGroupItem>
            </ListGroup>
          </Card>
          <Link class="btn btn-lg btn-primary" type="button" to="/">
            Go back
          </Link>
        </Col>
      )}
    </>
  );
};

export default Success;
