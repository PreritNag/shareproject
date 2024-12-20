import React, { Component } from "react";
import Carousel from "react-spring-3d-carousel";
import { config } from "react-spring";
import Card from "./Card";

class CCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeSlide: "",
    };
  }

  slides = [
    { key: 1, content: <Card /> },
    { key: 2, content: <Card /> },
    { key: 3, content: <Card /> },
    { key: 4, content: <Card /> },
    { key: 5, content: <Card /> },
    { key: 6, content: <Card /> },
    { key: 7, content: <Card /> },
    { key: 8, content: <Card /> },
  ].map((slide, index) => ({
    ...slide,
    onClick: () => this.setState({ changeSlide: index }),
  }));

  render() {
    return (
      <div style={{ width: "40%", height: "500px", margin: "0 auto" }}>
        <Carousel
          slides={this.slides}
          changeSlide={this.state.changeSlide}
          offsetRadius={10}
          animationConfig={config.gentle}
          showNavigation
        />
      </div>
    );
  }
}

export default CCarousel;
