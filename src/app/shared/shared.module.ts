import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { ChartModule } from 'primeng/chart';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeTableModule } from 'primeng/treetable';
import { SplitterModule } from 'primeng/splitter';
import { StepperModule } from 'primeng/stepper';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmationService, MessageService } from 'primeng/api';
// bootstrapApplication(AppComponent, {
//     providers: [provideEnvironmentNgxMask()],
// }).catch((err) => console.error(err));

@NgModule({
  declarations: [],
  imports: [
    AccordionModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    BadgeModule,
    ListboxModule,
    ButtonModule,
    CalendarModule,
    CascadeSelectModule,
    ChipsModule,
    DragDropModule,
    ConfirmDialogModule,
    TreeTableModule,
    ChartModule,
    StepperModule,
    ConfirmPopupModule,
    DataViewModule,
    ColorPickerModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    ImageModule,
    InputMaskModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OverlayPanelModule,
    PanelModule,
    PanelMenuModule,
    ProgressBarModule,
    RippleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SplitButtonModule,
    SplitterModule,
    StyleClassModule,
    TableModule,
    TabMenuModule,
    RadioButtonModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    MegaMenuModule,
    TooltipModule,
  ],

  exports: [
    AccordionModule,
    AutoCompleteModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CalendarModule,
    CascadeSelectModule,
    ListboxModule,
    ColorPickerModule,
    ChipsModule,
    DragDropModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    FormsModule,
    ReactiveFormsModule,
    StepperModule,
    DataViewModule,
    TreeTableModule,
    DialogModule,
    DividerModule,
    RadioButtonModule,
    DropdownModule,
    FieldsetModule,
    ImageModule,
    ChartModule,
    InputMaskModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OverlayPanelModule,
    PanelModule,
    PanelMenuModule,
    ProgressBarModule,
    RippleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SplitButtonModule,
    SplitterModule,
    StyleClassModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    MegaMenuModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class SharedModule {}
