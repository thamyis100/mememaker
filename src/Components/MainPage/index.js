import React from "react";
import {
	Modal,
	ModalHeader,
	ModalBody,
	FormGroup,
	Label,
	NavbarBrand,
} from "reactstrap";

const photos = [
	{ src: "/mememaker/images/vict-baby.png" },
	{ src: "/mememaker/images/ned.jpeg" },
	{ src: "/mememaker/images/devilgirl.jpg" },
	{ src: "/mememaker/images/trump.jpg" },
	{ src: "/mememaker/images/one-does-not.jpg" },
	{ src: "/mememaker/images/dank.png" },
	{ src: "/mememaker/images/boy.png" },
	{ src: "/mememaker/images/sad.png" },
	{ src: "/mememaker/images/wolf.png" },
	{ src: "/mememaker/images/fry.jpg" },
	{ src: "/mememaker/images/jobs.jpg" },
	{ src: "/mememaker/images/phone.jpg" },
	{ src: "/mememaker/images/oldie.png" },
	{ src: "/mememaker/images/image.png" },
	{ src: "/mememaker/images/doubt.png" },
	{ src: "/mememaker/images/crying.png" },
	{ src: "/mememaker/images/sponge.png" },
	{ src: "/mememaker/images/dog.png" },
	{ src: "/mememaker/images/frust.png" },
	{ src: "/mememaker/images/web.png" },
	{ src: "/mememaker/images/penguin.png" },
];

const initialState = {
	toptext: "",
	bottomtext: "",
	isTopDragging: false,
	isBottomDragging: false,
	topY: "10%",
	topX: "50%",
	bottomX: "50%",
	bottomY: "90%",
};

class MainPage extends React.Component {
	constructor() {
		super();
		this.state = {
			currentImage: 0,
			modalIsOpen: false,
			currentImagebase64: null,
			uploadedImage: null, // Hold the uploaded image temporarily
			...initialState,
		};
	}

	openImage = (indexOrUrl, uploadedImage) => {
		if (typeof indexOrUrl === "number") {
			const image = photos[indexOrUrl];
			const base_image = new Image();
			base_image.onload = () => {
				const base64 = this.getBase64Image(base_image);
				this.setState({
					currentImage: indexOrUrl,
					modalIsOpen: true,
					currentImagebase64: base64,
					uploadedImage: null,
					...initialState,
				});
			};
			base_image.src = image.src;
		} else {
			const base_image = new Image();
			base_image.onload = () => {
				this.setState({
					currentImage: -1,
					modalIsOpen: true,
					currentImagebase64: indexOrUrl,
					uploadedImage: indexOrUrl,
					...initialState,
				});
			};
			base_image.src = indexOrUrl;
		}
	};

	// Method to handle image upload
	handleImageUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			this.setState({
				uploadedImage: reader.result, // Hold the uploaded image temporarily in state
			});
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	toggle = () => {
		this.setState((prevState) => ({
			modalIsOpen: !prevState.modalIsOpen,
		}));
	};

	changeText = (event) => {
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value,
		});
	};

	getStateObj = (e, type) => {
		let rect = this.imageRef.getBoundingClientRect();
		const xOffset = e.clientX - rect.left;
		const yOffset = e.clientY - rect.top;
		let stateObj = {};
		if (type === "bottom") {
			stateObj = {
				isBottomDragging: true,
				isTopDragging: false,
				bottomX: `${xOffset}px`,
				bottomY: `${yOffset}px`,
			};
		} else if (type === "top") {
			stateObj = {
				isTopDragging: true,
				isBottomDragging: false,
				topX: `${xOffset}px`,
				topY: `${yOffset}px`,
			};
		}
		return stateObj;
	};

	handleMouseDown = (e, type) => {
		const stateObj = this.getStateObj(e, type);
		document.addEventListener("mousemove", (event) =>
			this.handleMouseMove(event, type)
		);
		this.setState({
			...stateObj,
		});
	};

	handleMouseMove = (e, type) => {
		if (this.state.isTopDragging || this.state.isBottomDragging) {
			let stateObj = {};
			if (type === "bottom" && this.state.isBottomDragging) {
				stateObj = this.getStateObj(e, type);
			} else if (type === "top" && this.state.isTopDragging) {
				stateObj = this.getStateObj(e, type);
			}
			this.setState({
				...stateObj,
			});
		}
	};

	handleMouseUp = (event) => {
		document.removeEventListener("mousemove", this.handleMouseMove);
		this.setState({
			isTopDragging: false,
			isBottomDragging: false,
		});
	};

	convertSvgToImage = () => {
		const svg = this.svgRef;
		let svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		canvas.setAttribute("id", "canvas");
		const svgSize = svg.getBoundingClientRect();
		canvas.width = svgSize.width;
		canvas.height = svgSize.height;
		const img = document.createElement("img");
		img.setAttribute(
			"src",
			"data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
		);
		img.onload = function () {
			canvas.getContext("2d").drawImage(img, 0, 0);
			const canvasdata = canvas.toDataURL("image/png");
			const a = document.createElement("a");
			a.download = "meme.png";
			a.href = canvasdata;
			document.body.appendChild(a);
			a.click();
		};
	};

	getBase64Image(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/png");
		return dataURL;
	}
	render() {
		const { uploadedImage } = this.state;
		const image = uploadedImage || photos[this.state.currentImage].src; // Use uploaded image if available

		// Check if the image is defined before accessing its src property
		const imageSrc = image;

		// Calculate the dimensions
		const base_image = new Image();
		base_image.src = imageSrc; // Use imageSrc here instead of image.src
		var wrh = base_image.width / base_image.height;
		var newWidth = 600;
		var newHeight = newWidth / wrh;
		const textStyle = {
			fontFamily: "Impact",
			fontSize: "50px",
			textTransform: "uppercase",
			fill: "#FFF",
			stroke: "#000",
			userSelect: "none",
		};

		return (
			<div>
				<div className="main-content">
					<div className="sidebar">
						<NavbarBrand href="/">Make-a-Meme</NavbarBrand>
						<p>This is a modified project.</p>
						<p>Thanks to Avanthika Meenakshi for the initial project</p>
					</div>
					<div className="content">
						{photos.map((image, index) => (
							<div className="image-holder" key={image.src}>
								<span className="meme-top-caption">Top text</span>
								<img
									style={{
										width: "100%",
										cursor: "pointer",
										height: "100%",
									}}
									alt={index}
									src={image.src}
									onClick={() => this.openImage(index)}
									role="presentation"
								/>
								<span className="meme-bottom-caption">Bottom text</span>
							</div>
						))}
						{/* Conditional rendering for the uploaded image */}
						{uploadedImage && (
							<div className="image-holder upload-image">
								<span className="meme-top-caption">Top text</span>
								{/* eslint-disable-next-line*/}
								<img
									src={uploadedImage}
									alt="Uploaded Image"
									onClick={() => this.openImage(uploadedImage)}
									style={{
										width: "100%",
										cursor: "pointer",
										height: "100%",
									}}
								/>
								<span className="meme-bottom-caption">Uploaded Image</span>
							</div>
						)}
						{!uploadedImage && (
							<div className="image-holder upload-image">
								<input
									type="file"
									accept="image/*"
									onChange={this.handleImageUpload}
								/>
								<span className="upload-text">Upload an Image</span>
							</div>
						)}
					</div>
				</div>
				<Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
					<ModalHeader toggle={this.toggle}>Make-a-Meme</ModalHeader>
					<ModalBody>
						<svg
							width={newWidth}
							id="svg_ref"
							height={newHeight}
							ref={(el) => {
								this.svgRef = el;
							}}
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<image
								ref={(el) => {
									this.imageRef = el;
								}}
								xlinkHref={
									this.state.uploadedImage
										? this.state.uploadedImage
										: this.state.currentImagebase64
								}
								height={newHeight}
								width={newWidth}
							/>
							<text
								style={{
									...textStyle,
									zIndex: this.state.isTopDragging ? 4 : 1,
								}}
								x={this.state.topX}
								y={this.state.topY}
								dominantBaseline="middle"
								textAnchor="middle"
								onMouseDown={(event) => this.handleMouseDown(event, "top")}
								onMouseUp={(event) => this.handleMouseUp(event, "top")}
							>
								{this.state.toptext}
							</text>
							<text
								style={textStyle}
								dominantBaseline="middle"
								textAnchor="middle"
								x={this.state.bottomX}
								y={this.state.bottomY}
								onMouseDown={(event) => this.handleMouseDown(event, "bottom")}
								onMouseUp={(event) => this.handleMouseUp(event, "bottom")}
							>
								{this.state.bottomtext}
							</text>
						</svg>
						<div className="meme-form">
							<FormGroup>
								<Label for="toptext">Top Text</Label>
								<input
									className="form-control"
									type="text"
									name="toptext"
									id="toptext"
									placeholder="Add text to the top"
									onChange={this.changeText}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="bottomtext">Bottom Text</Label>
								<input
									className="form-control"
									type="text"
									name="bottomtext"
									id="bottomtext"
									placeholder="Add text to the bottom"
									onChange={this.changeText}
								/>
							</FormGroup>
							<button
								onClick={() => this.convertSvgToImage()}
								className="btn btn-primary"
							>
								Download Meme!
							</button>
						</div>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

export default MainPage;
