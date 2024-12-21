import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-graph-config',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './graph-config.component.html',
  styleUrls: ['./graph-config.component.css']
})
export class GraphConfigComponent implements AfterViewInit {
  @ViewChild('svg') private svgRef!: ElementRef;

  positionsShapes!: any;
  nodes: any[] = [];
  links: any[] = [];
  state: any = {};
  config: any = {};

  @Input() parametre!: string;
  @Input() graphName!: string;

  constructor(private http: HttpClient, private router: Router) {}

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData() {
    this.http.get('assets/config.json').subscribe((data: any) => {
      this.nodes = data.instances;
      this.config = data.config;
      this.state = data.state;
      this.initializeGraph();
    });
  }

  private initializeGraph() {
    const svg = d3.select(this.svgRef.nativeElement)
      .attr("viewBox", "0 0 1000 500") // Replace with dynamic dimensions if needed
      .style('max-height', '100%')
      .style('border', '1px solid black');

    // Define links
    this.nodes.forEach(d => {
      if (d.dependencies != null) {
        for (const target of d.dependencies) {
          this.links.push({ source: d.name, target: target });
        }
      }
    });

    this.nodes.forEach(node => {
      const position = this.state.graphName[node.name];
      if (position) {
        node.x = position.x;
        node.y = position.y;
      }
    });


    // Filter valid links
    const filteredLinks = this.links.filter(link => {
      const sourceExists = this.nodes.some(node => node.name === link.source);
      const targetExists = this.nodes.some(node => node.name === link.target);
      return sourceExists && targetExists;
    });

    // Apply layout
    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(filteredLinks).id((d: any) => d.name).strength(0));

    // Add elements to SVG
    this.createSvgElements(svg, simulation);

    simulation.on('tick', () => {
      svg.selectAll('line')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      svg.selectAll('g')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  }

  private createSvgElements(svg: any, simulation: any) {

    const drag = (simulation: any): any => {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = Math.max(0, Math.min(1000, event.x));
        event.subject.fy = Math.max(0, Math.min(500, event.y));
      }

      const dragended = (event: any): void => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any;
    }
    const link = svg.selectAll("line")
      .data(this.links)
      .enter()
      .append("line")
      .style("stroke", "black")
      .style("z-index", 0);

    const shapes = svg.selectAll("g")
      .data(this.nodes)
      .enter()
      .append("g")
      .call(drag(simulation))
      .style("stroke-width", 4)
      .style("cursor", "pointer")
      .attr("description","This is the call of the description")
      .attr("transform", (d: { x: any; y: any; }) => `translate(${d.x},${d.y})`)
      .style("z-index", 1);

    // shapes.append("circle")
    //   .attr("r", 35)
    //   .attr('stroke', (d: { model_type: string | number; }) => this.config.graph.color[d.model_type] || this.config.graph.color["default"])
    //   .style("fill", 'white');
    shapes.each((d: any, i: number, nodes: any) => {
      const shapeType = this.getShapeType(d.model_type); // Détermine la forme

      if (shapeType === 'circle') {
        d3.select(nodes[i])
          .append("circle")
          .attr("r", 35)
          .attr('stroke', this.config.graph.color[d.model_type] || this.config.graph.color["default"])
          .style("fill", 'white');
      } else if (shapeType === 'square') {
        d3.select(nodes[i])
          .append("rect")
          .attr("width", 70)
          .attr("height", 70)
          .attr("x", -35) // Centrer le carré
          .attr("y", -35)
          .attr('stroke', this.config.graph.color[d.model_type] || this.config.graph.color["default"])
          .style("fill", 'white');
      }
    });

    shapes.append("text")
      .text((d: { name: any; }) => d.name)
      .style("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold");

  }

  private getShapeType(modelType: string): string {
    const group = this.config.graph.group.find((g: any) =>
      g.category.some((cat: string) => modelType.startsWith(cat))
    );
    return group?.shape || 'circle'; // Par défaut, on utilise "circle"
  }
}
