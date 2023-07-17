import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '@ims/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appShowAuthed]',
  standalone: true,
})
export class ShowAuthedDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  condition = false;

  ngOnInit() {
    this.userService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      if (
        (isAuthenticated && this.condition) ||
        (!isAuthenticated && !this.condition)
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }
}
