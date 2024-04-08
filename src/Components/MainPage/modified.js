<div>
	<div className="main-content">
		<div className="sidebar">
			<NavbarBrand href="/">Make-a-Meme</NavbarBrand>
			<p>This is a modified project.</p>
			<p>thanks for Avanthika Meenakshi for the initial project</p>
		</div>
		<div className="content">
			<div className="image-holder upload-image">
				<input type="file" accept="image/*" onChange={this.handleImageUpload} />
				<span className="upload-text">Upload an Image</span>
			</div>
			{!this.state.uploadedImage &&
				photos.map((image, index) => (
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
		</div>
	</div>
	<Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
		{this.state.uploadedImage ? (
			<ModalHeader toggle={this.toggle}>Uploaded Image</ModalHeader>
		) : (
			<ModalHeader toggle={this.toggle}>Make-a-Meme</ModalHeader>
		)}
		<ModalBody>
			{/* Display the uploaded image */}
			{this.state.uploadedImage && (
				<img
					src={this.state.uploadedImage}
					alt="Uploaded Image"
					style={{ width: "100%" }}
				/>
			)}
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
					xlinkHref={this.state.currentImagebase64}
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
</div>;
