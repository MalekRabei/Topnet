import React, { Component } from "react";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    console.log("constructor ", this.props);
    this.state = {
      Img: null,
      imgSrc: 1,
    };
    this.onFileChange = this.onFileChange.bind(this);
  }

  //to get file value
  onFileChange(event) {
    // Assuming only image
    var file = this.refs.file.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      this.setState({
        imgSrc: [reader.result],
      });
    }.bind(this);
    console.log(url); // Would see a path?
    // TODO: concat files

    console.log("event.target.files[0]", event.target.files[0]);
    this.setState({ Img: event.target.files[0] }, () => {
      this.props.ImageUpload(this.state.Img);
    });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.image && this.state.Img === null) {
      console.log("nextprops.image", nextprops.image, "file", this.state);
      this.setState({
        imgSrc: process.env.PUBLIC_URL + "/Images/" + nextprops.image,
      });
    }
  }

  render() {
    console.log("state image ", this.state);
    // if (this.props.image)
    // {
    //   this.setState({imgSrc: process.env.PUBLIC_URL + "/Images/"+this.props.image})
    // }

    //console.log("imgage uploader input ", this.state);
    let labelText = "";
    if (this.state.Img === null && this.state.imgSrc === null) {
      labelText = "Select image";
    } else {
      labelText = "Change";
    }
    return (
      <>
        {" "}
        <div>
          {this.state.imgSrc !== null ? (
            <img
              src={this.state.imgSrc}
              alt="dummy"
              width="300"
              height="300"
              className="rounded"
            />
          ) : (
            <>
              <span className="fa-stack fa-2x mt-3 mb-2">
                <i className="fas fa-circle fa-stack-2x" />
                <i className="fas fa-store fa-stack-1x fa-inverse" />
              </span>
            </>
          )}
        </div>
        <br></br>
        <div className="form-group">
          <label
            htmlFor={this.state.imgSrc}
            className={
              "btn " +
              (labelText === "Select image"
                ? "btn-outline-default "
                : "btn-outline-danger") +
              " btn-file btn-round"
            }
          >
            {labelText}
          </label>

          <input
            ref="file"
            id={this.state.imgSrc}
            style={{ display: "none" }}
            type="file"
            name="Imgupload"
            accept=".jpg, .jpeg, .png"
            onChange={this.onFileChange}
          />
        </div>
      </>
    );
  }
}
export default ImageUpload;
