import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Container } from "reactstrap";
import { SlSymbolMale, SlSymbleFemale } from "react-icons/sl";
import { TiHeartFullOutline } from "react-icons/ti";
import { FcLike } from "react-icons/fc";

export default function Movies3({ data }) {
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
            <TheMovie data={data} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export function TheMovie({ data }) {
  if (!data) return <div>Carregando...</div>;
  if (!data.id) return <div> Personagem enixistente </div>;
  return (
    <div>
      <div>
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={data.image}
                className="img-fluid rounded-start"
                alt="..."
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">
                  {data.name} --{" "}
                  {data.gender === "Male" ? (
                    <SlSymbolMale />
                  ) : (
                    <SlSymbleFemale />
                  )}
                </h5>
                {data.status === "Dead" ? (
                  <div>
                    {" "}
                    <TiHeartFullOutline /> {data.status} - {data.species}
                  </div>
                ) : (
                  <div>
                    <FcLike /> {data.status} - {data.species}
                  </div>
                )}
                <br />
                <p className="card-text">Last known location:</p>
                <h6>{data.origin.name}</h6>
                <p className="card-text">
                  <small className="text-muted">{data.created}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: "1" } },
      { params: { id: "2" } },
      { params: { id: "3" } },
      { params: { id: "4" } },
      { params: { id: "5" } },
      { params: { id: "6" } },
      { params: { id: "7" } },
      { params: { id: "8" } },
      { params: { id: "9" } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/
${params.id}`);
  console.log("impressao do fetch");
  console.log(res);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}
