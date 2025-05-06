import {
  getAllByTestId,
  getByLabelText,
  getByText,
  render,
  screen,
  within,
} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import TicketListComponent from './ticket-list.component';
import { TicketsService } from '../../data-access/tickets.service';
import { computed } from '@angular/core';
import { Ticket, Filter, Sort } from '../../data-access/ticket.model';
import { Subject } from 'rxjs';
import { TicketItemComponent } from '../../ui/ticket-item/ticket-item.component';
import { TicketFormComponent } from '../../ui/ticket-form/ticket-form.component';
import { FilterSortComponent } from '../../ui/filter-sort/filter-sort.component';

describe('TicketListComponent', () => {
  let mockTickets: Ticket[];
  let mockTicketsService: Partial<TicketsService>;

  const defaultFilter: Filter = { status: 'all', searchTerm: '' };
  const defaultSort: Sort = { field: 'createdAt', direction: 'asc' as const };

  const setupMockService = (
    options: {
      tickets?: Ticket[];
      isLoaded?: boolean;
      error?: string | null;
      filter?: Filter;
      sort?: Sort;
    } = {}
  ) => {
    return {
      tickets: computed(() => options.tickets || mockTickets),
      loaded: computed(() => options.isLoaded ?? true),
      error: computed(() => options.error || null),
      filter: computed(() => options.filter || defaultFilter),
      sort: computed(() => options.sort || defaultSort),
      createTicket$: new Subject<any>(),
      changeStatus$: new Subject<any>(),
      deleteTicket$: new Subject<any>(),
      filterChange$: new Subject<any>(),
      sortChange$: new Subject<any>(),
    };
  };

  const renderComponent = (serviceOptions = {}) => {
    mockTicketsService = setupMockService(serviceOptions);

    return render(TicketListComponent, {
      imports: [TicketItemComponent, TicketFormComponent, FilterSortComponent],
      providers: [{ provide: TicketsService, useValue: mockTicketsService }],
    });
  };

  beforeEach(() => {
    mockTickets = [
      {
        id: 1,
        title: 'First ticket',
        description: 'Description for first ticket',
        status: 'open',
        createdAt: new Date('2025-05-01'),
        updatedAt: null,
      },
      {
        id: 2,
        title: 'Second ticket',
        description: 'Description for second ticket',
        status: 'closed',
        createdAt: new Date('2025-05-02'),
        updatedAt: new Date('2025-05-03'),
      },
    ];
  });

  describe('Render States', () => {
    it('should show loading state when tickets are not loaded', async () => {
      await renderComponent({ isLoaded: false });
      screen.getByTestId('loading-message');
    });

    it('should show error message when there is an error', async () => {
      const errorMessage = 'Failed to load tickets';
      await renderComponent({ error: errorMessage });
      screen.getByText(errorMessage);
    });

    it('should render ticket items when tickets are loaded without errors', async () => {
      await renderComponent();
      const ticketItems = screen.getAllByTestId(/ticket-item-/);
      expect(ticketItems.length).toBe(mockTickets.length);
      screen.getByText(mockTickets[0].title);
      screen.getByText(mockTickets[1].title);
    });

    it('should render the filter-sort component', async () => {
      // TODO: Implement this test by:
      // 1. Render the component
      // 2. Check if the filter-sort component is rendered by looking for its test ID
    });
  });

  describe('Event Handling', () => {
    it('should forward create event from ticket-form to ticketService', async () => {
      const user = userEvent.setup();
      await renderComponent();
      const spy = jest.spyOn(mockTicketsService.createTicket$!, 'next');
      const newTicket = {
        title: 'New Ticket',
        description: 'Description for new ticket',
        status: 'open',
      };
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const statusSelect = screen.getByLabelText(/^status$/i);
      const createButton = screen.getByRole('button', { name: /create/i });

      await user.type(titleInput, newTicket.title);
      await user.type(descriptionInput, newTicket.description);
      await user.selectOptions(statusSelect, newTicket.status);
      await user.click(createButton);
      expect(spy).toHaveBeenCalledWith(newTicket);
    });

    it('should forward filter changes to ticketService', async () => {
      // TODO: Implement this test by:
      // 1. Render the component
      // 2. Create a spy on mockTicketsService.filterChange$.next
      // 3. Select a status from the dropdown
      // 4. Verify the spy was called with updated filter including new status
      // 5. Type in the search input
      // 6. Verify the spy was called with updated filter including search term
    });

    it('should forward sort changes to ticketService', async () => {
      // TODO: Implement this test by:
      // 1. Render the component
      // 2. Create a spy on mockTicketsService.sortChange$.next
      // 3. Select a sort field from the dropdown
      // 4. Verify the spy was called with updated sort object
      // 5. Click the sort direction button
      // 6. Verify the spy was called with updated direction
    });

    it('should forward status changes from ticket-item to ticketService', async () => {
      // TODO: Implement this test by:
      // 1. Set up userEvent
      // 2. Render the component
      // 3. Create a spy on mockTicketsService.changeStatus$.next
      // 4. Define expected status change object
      // 5. Find the first ticket item using its test ID
      // 6. Find and click the "Mark as Complete" button within that ticket
      // 7. Verify the spy was called with the status change object
    });

    it('should forward delete events from ticket-item to ticketService', async () => {
      // TODO: Implement this test by:
      // 1. Set up userEvent
      // 2. Render the component
      // 3. Create a spy on mockTicketsService.deleteTicket$.next
      // 4. Store reference to the ticket that will be deleted
      // 5. Find the ticket item using its test ID
      // 6. Find and click the delete button within that ticket
      // 7. Verify the spy was called with the ticket to delete
    });
  });
});
