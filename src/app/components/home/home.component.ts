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
  private currentColor: string = 'green'; // Couleur initiale

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
    const savedImage = this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height); // Sauvegarde le dessin
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (savedImage && this.ctx) {
      this.ctx.putImageData(savedImage, 0, 0); // Restaure le dessin après redimensionnement
    }
  }

  @HostListener('mousedown', ['$event'])
  startDrawing(event: MouseEvent) {
    if (this.ctx) {
      this.isDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mousemove', ['$event'])
  draw(event: MouseEvent) {
    if (this.isDrawing && this.ctx) {
      this.ctx.strokeStyle = this.currentColor; // Utilise la couleur actuelle
      this.ctx.lineWidth = 5; // Épaisseur de la ligne
      this.ctx.lineCap = 'round'; // Fini arrondi
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

  // @HostListener('mouseleave')
  // cancelDrawing() {
  //   this.isDrawing = false;
  // }

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
}
