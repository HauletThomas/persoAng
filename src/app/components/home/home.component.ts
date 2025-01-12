import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private isDrawing = false;
  private currentColor: string = 'green';
  private isOverPalette = false;
  private history: ImageData[] = [];



  colors: string[] = [
    'green', 'red', 'blue', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'brown', 'black'
  ];

  ngAfterViewInit() {
    this.canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const savedImage = this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (savedImage && this.ctx) {
      this.ctx.putImageData(savedImage, 0, 0);
    }
  }

  @HostListener('mousedown', ['$event'])
  startDrawing(event: MouseEvent) {
    if (this.ctx) {
      this.isDrawing = true;
      this.saveHistory();
      this.ctx.beginPath();
      this.ctx.moveTo(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mousemove', ['$event'])
  draw(event: MouseEvent) {
    if (this.isDrawing && this.ctx && !this.isMouseOverPalette(event)) {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = 5;
      this.ctx.lineCap = 'round';
      this.ctx.lineTo(event.offsetX, event.offsetY);
      this.ctx.stroke();
    }
  }

  @HostListener('mouseup')
  stopDrawing() {
    if (this.ctx) {
      this.isDrawing = false;
      this.ctx.closePath();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      this.undo(); // Appelle la fonction Undo avec Ctrl+Z
    }
  }

  saveCanvas() {
    if (this.canvas) {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = this.canvas.toDataURL('image/png');
      link.click();
    }
  }

  // Change la couleur de dessin
  changeColor(color: string) {
    this.currentColor = color;
  }

  private isMouseOverPalette(event: MouseEvent): boolean {
    const palette = document.getElementById('colorPalette');
    if (palette) {
      const rect = palette.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    }
    return false;
  }
  onPaletteEnter() {
    this.isOverPalette = true;
    this.isDrawing = false;
  }

  onPaletteLeave() {
    this.isOverPalette = false;
  }
  resetCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.history = [];
    }
  }

  undo() {
    if (this.ctx && this.history.length > 0) {
      const lastState = this.history.pop();
      if (lastState) {
        this.ctx.putImageData(lastState, 0, 0);
      }
    }
  }
  private saveHistory() {
    if (this.ctx) {
      const snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.history.push(snapshot);
    }
  }
}
