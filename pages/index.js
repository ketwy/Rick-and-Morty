import useSWR from "swr";
import { useState } from "react";
import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Container } from "reactstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { SlSymbolMale, SlSymbleFemale } from "react-icons/sl";

let onClickSort;
let order = "ASC";

export default function Movies3() {
  const [state, setState] = useState({
    url: "",
    titleSearchString: "",
    orderBy: { index: "", order: "ASC" },
  });
  const [validate, setValidate] = useState({ message: "" });
  const { data } = useSWR(state.url, async () => {
    if (!state.url || !state.titleSearchString) return { Search: "" };
    if (state.url === "" || state.titleSearchString === "")
      return { Search: "" };
    const res = await fetch(`${state.url}/?name=${state.titleSearchString}`);
    const json = await res.json();
    return json;
  });

  if (state.orderBy && state.orderBy.index !== "") {
    if (data) {
      data.results.sort((a, b) => {
        if (state.orderBy.order === "ASC") {
          return a[state.orderBy.index] > b[state.orderBy.index] ? 1 : -1;
        } else {
          return b[state.orderBy.index] > a[state.orderBy.index] ? 1 : -1;
        }
      });
    }
  }

  onClickSort = (dataIndex) => {
    setState({
      url: "https://rickandmortyapi.com/api/character",
      titleSearchString: state.titleSearchString,
      orderBy: {
        index: dataIndex,
        order: state.orderBy.order === "ASC" ? "DESC" : "ASC",
      },
    });

    order = state.orderBy.order === "ASC" ? "DESC" : "ASC";
  };

  const onClickHandler = (e) => {
    e.preventDefault();
    let s = document.getElementById("titleSearchString").value;
    if (s === "") {
      setValidate({ message: "Título vazio!" });
    } else {
      if (state.url === "") {
        setState({
          url: "https://rickandmortyapi.com/api/character",
          titleSearchString: s,
          orderBy: state.orderBy,
        });
      } else {
        setState({
          url: "",
          titleSearchString: state.titleSearchString,
          orderBy: state.orderBy,
        });
      }
      setValidate({ message: "" });
    }
  };

  return (
    <div>
      <div>
        <Head>
          <title> RickAndMorty </title>
        </Head>
      </div>
      <div className="p-5 text-center bg-dark">
        <h1 className="text-light">Rick and Morty</h1>
        <p className="text-light">by: Ketlly Azevedo de Medeiros</p>
      </div>
      <Nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="../">
                Home
              </a>
            </li>
          </ul>
        </div>
      </Nav>
      <Container>
        <div className="row">
          <div className="mt-3">
            <TheForm message={validate.message} />
            <TheLink url={state.url} handler={onClickHandler} />
          </div>
          <div className="mt-3">
            <TheMovies
              data={data ? data : { Search: "" }}
              show={state.url !== ""}
              handler={onClickHandler}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export function TheForm({ message }) {
  return (
    <div>
      <form className="form-inline ">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Personagem
            </span>
          </div>
          <input
            className="form-control"
            type="text"
            autoComplete="true"
            required
            placeholder="Digite o título..."
            id="titleSearchString"
            name="titleSearchString"
          />
          <p style={{ color: "red" }}>{message}</p>
        </div>
      </form>
    </div>
  );
}

export function TheMovies({
  data,
  show,
  tag = ["name", "species", "status"],
  handler
}) {
  if (!show) return <div></div>;
  if (!data) return <div></div>;
  if (data.error) return <div>Falha na pesquisa</div>;
  if (data.Error) return <div>Filme não encontrado na pesquisa</div>;
  if (data.Search === "")
    return (
      <div className="spinner-grow text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  return (
    <div className="table-responsive" style={{ marginLeft: "1rem" }}>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr align="center">
            {tag.map((item) => (
              <th scope="col">
                {item}
                <SortIcon dataIndex={item} />
              </th>
            ))}
            <th scope="col">View more</th>
          </tr>
        </thead>
        <tbody className="table-hover">
          {data.results.map((m) => (
            <tr key={m.id}>
              {tag.map((objet) => (
                <td align="center">{m[objet]}</td>
              ))}
              <td align="center">
                <Example data={data ? data : { results: "" }} id={m.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TheLink({ url, handler }) {
  return (
    <div>
      <button
        className="btn btn-outline-dark btn-sm"
        href=" "
        onClick={handler}
      >
        {url === "" ? "Show" : "Hide"}
      </button>
    </div>
  );
}

export function SortIcon({ dataIndex }) {
  return (
    <button
      onClick={() => onClickSort(dataIndex)}
      className="btn btn-outline-light btn-sm"
    >
      order
    </button>
  );
}

function Example({ data, id, tag = ["name", "image", "species", "status"] }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        ☜(ˆ▿ˆc)
      </Button>
      {data.results.map((m) => {if (m.id === id) return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {m.name}{" "}
              <button className="btn btn-outline-dark btn-sm">
                {m.gender === "Male" ? <SlSymbolMale /> : <SlSymbleFemale />}
              </button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={m.image}></img>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" onClick={handleClose} href={"persona/"+ m.id}>
              View more
            </Button>
          </Modal.Footer>
        </Modal>
      );})}
    </>
  );
}
