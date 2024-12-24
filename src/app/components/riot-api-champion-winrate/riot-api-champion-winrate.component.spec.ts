import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiotApiChampionWinrateComponent } from './riot-api-champion-winrate.component';

describe('RiotApiChampionWinrateComponent', () => {
  let component: RiotApiChampionWinrateComponent;
  let fixture: ComponentFixture<RiotApiChampionWinrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiotApiChampionWinrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiotApiChampionWinrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
