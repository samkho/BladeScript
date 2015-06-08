class BladeScript {
}

class Dxf {

	ctx: CanvasRenderingContext2D;

	header: string;
	trailer: string;

	data: string;

	lineHeader: string;
	circleHeader: string;

	constructor(ctx: CanvasRenderingContext2D) {

		this.ctx = ctx;

		this.header = "0\r\nSECTION\r\n2\r\nENTITIES\r\n";
		this.trailer = "0\r\nENDSEC\r\n0\r\nEOF\r\n";

		this.lineHeader = "0\r\nLINE\r\n8\r\nCutLayer\r\n";
		this.circleHeader = "0\r\n\CIRCLE\r\n8\r\nCutLayer\r\n";

		this.reset();
	}

	reset() {
		this.data = "";
	}

	getDump() {
		return this.header + this.data + this.trailer;
	}

	line(x1: number, y1: number, x2: number, y2: number) {

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();

		y1 = -y1;
		y2 = -y2;

		this.data +=
			this.lineHeader +
			"10\r\n" + x1 + "\r\n" +
			"20\r\n" + y1 + "\r\n" +
			"11\r\n" + x2 + "\r\n" +
			"21\r\n" + y2 + "\r\n";
	}

	circle(x: number, y: number, r: number) {

		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 360);
		this.ctx.stroke();

		y = -y;

		this.data +=
			this.circleHeader +
			"10\r\n" + x + "\r\n" +
			"20\r\n" + y + "\r\n" +
			"40\r\n" + r + "\r\n";
	}
}

class View {
	src: HTMLElement;
	dst: HTMLElement;
	hdc: HTMLCanvasElement;

	dxf: Dxf;

	constructor(src: HTMLElement, dst: HTMLElement, hdc: HTMLCanvasElement) {
		this.src = src;
		this.dst = dst;
		this.hdc = hdc;

		this.dxf = new Dxf(hdc.getContext("2d"));
	}

	onClick() {

		var s = this.dxf.getDump();
		//this.dst.innerText = s;

		var w = window.open("", "BladeScript.dxf", "width=640, height=480");
		w.document.write("<PLAINTEXT>");
		w.document.write(s);
		w.document.close();
	}

	run() {
		var s: string = this.src.innerText;

		this.dxf.reset();

		with (this.dxf) {
			eval(s);
		}
	}
}

window.onload = () => {

	var dst = document.getElementById('dst');
	var src: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('src');
	var hdc: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('hdc');

	src.spellcheck = false;

	var view = new View(src, dst, hdc);

	var run = document.getElementById('run');
	run.onclick = () => view.run();

	var toDxf = document.getElementById('toDxf');
	toDxf.onclick = () => view.onClick();
};
