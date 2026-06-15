# Advanced Admin User Management Dashboard

## Overview

This is a comprehensive admin dashboard for managing users in the Peaklab application. It provides advanced features for managing user data, panels, blood tests, and biomarker results.

## Features

### Core Capabilities

1. **User Management**

- View all users with search and filtering
- View detailed user information
- Update user roles (admin/user)
- Real-time user statistics

2. **Panel Management**

- Assign panels to users
- Update user panels
- Remove panel assignments
- View panel details and biomarkers

3. **Blood Test Management**

- Create new blood tests for users
- Delete blood tests
- View blood test history
- Associate tests with panels

4. **Biomarker Results Management**

- Insert biomarker results for blood tests
- Update existing results
- Auto-fill reference ranges
- Categorized biomarker views
- Flag calculation (High/Low/Normal)
- Support for panel-specific biomarkers only

5. **Advanced Data Views**

- Comprehensive user overview
- Blood test history visualization
- Biomarker results with trend tracking
- Category-based filtering

## Architecture

### Backend API Endpoints

#### User Management

- `GET /api/admin/users/:userId` - Get detailed user information
- `PUT /api/auth/admin/users/role` - Update user role
- `GET /api/auth/admin/users` - Get all users

#### Panel Management

- `PUT /api/admin/users/:userId/panel` - Assign/update user panel
- `DELETE /api/admin/users/:userId/panel` - Remove user panel
- `GET /api/admin/panels/:panelId/biomarkers` - Get panel biomarkers

#### Blood Test Management

- `POST /api/admin/users/:userId/blood-tests` - Create blood test
- `DELETE /api/admin/blood-tests/:testId` - Delete blood test
- `GET /api/admin/blood-tests/:testId/results` - Get test results

#### Biomarker Results

- `POST /api/admin/blood-tests/:testId/results` - Upsert biomarker results
- `DELETE /api/admin/results/:resultId` - Delete result

### Frontend Structure

```
apps/web/src/pages/Admin/UserManagement/
 UserManagement.tsx # Main dashboard
 components/
 UsersTable.tsx # User list table
 UserDetailsModal.tsx # Comprehensive user modal
 UserInfoCard.tsx # User profile card
 PanelManagement.tsx # Panel assignment
 BloodTestManagement.tsx # Blood test CRUD
 BiomarkerResultsForm.tsx # Results input form
 UserBloodTestsView.tsx # Test history view
 UserBiomarkersView.tsx # Biomarker trends view
```

### Backend Structure

```
apps/backend/src/
 controllers/adminUserManagementController/
 adminUserManagementController.ts
 index.ts
 routes/adminUserManagementRouter/
 adminUserManagementRouter.ts
 index.ts
```

## Usage Guide

### Accessing the Dashboard

1. Navigate to `/admin` as an admin user
2. Click on "User Management" card
3. You'll see a list of all users with search and filter capabilities

### Managing a User

1. **View User Details**: Click the eye icon on any user
2. **Navigate Tabs**:

- **Overview**: Quick summary of user data
- **Panel Management**: Assign/update panels
- **Blood Tests**: Create and manage tests
- **Biomarkers**: View all biomarker data

### Creating a Blood Test

1. Open user details modal
2. Go to "Blood Tests" tab
3. Click "Create Blood Test"
4. Fill in:

- Select panel
- Sample date
- Sample time

5. Click "Create Blood Test"

### Adding Biomarker Results

1. Create or select a blood test
2. Click " Manage Results"
3. The form shows all biomarkers for the test's panel
4. For each biomarker:

- Enter the value
- Click to auto-fill reference ranges
- Optionally override unit/ranges/flag

5. Click "Save Results"

### Panel-Specific Features

- Only biomarkers linked to the user's assigned panel are shown
- Reference ranges auto-fill from biomarker configuration
- Results are grouped by category for better organization
- Flags are calculated automatically based on reference ranges

## Technical Details

### Authentication & Authorization

- All endpoints require authentication (`requireAuth` middleware)
- Admin-only endpoints use `requireAdmin` middleware
- Role validation happens at both frontend and backend

### Data Flow

1. **User Selection**: Admin clicks user → Fetches complete user data
2. **Panel Assignment**: Updates `user_panel_links` table
3. **Blood Test Creation**: Inserts into `blood_tests` table
4. **Results Entry**: Upserts into `blood_test_results` table

### Database Schema

**Tables Used:**

- `profiles` - User profile data
- `user_panel_links` - User-panel assignments
- `blood_tests` - Blood test records
- `blood_test_results` - Individual biomarker results
- `panel_biomarkers` - Panel-biomarker relationships
- `biomarkers` - Biomarker definitions
- `categories` - Biomarker categories

### Advanced Features

#### Auto-fill Reference Ranges

Clicking the button automatically fills:

- Reference low: `biomarker.normal_min`
- Reference high: `biomarker.normal_max`
- Unit: `biomarker.unit`

#### Smart Filtering

- Search by email, name, or username
- Filter by user role
- Category-based biomarker filtering

#### Responsive Design

- Works on desktop and tablet
- Optimized modal sizes
- Collapsible sections

## Styling & UX

### Design System

- Consistent color coding:
- Admin: Gold (#fef3c7)
- User: Blue (#dbeafe)
- High values: Red
- Low values: Orange
- Normal: Green

### Interaction Patterns

- Modal-based workflows for complex operations
- Inline forms for quick edits
- Confirmation dialogs for destructive actions
- Loading states for all async operations

### Icons

- Eye: View details
- Plus: Create new
- Trash: Delete
- Save: Save changes
- ArrowLeft: Navigate back

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Modal content loads only when opened
2. **Selective Fetching**: Only fetch what's needed per view
3. **Efficient Updates**: Optimistic UI updates where appropriate
4. **Pagination-Ready**: Structure supports future pagination

### Caching Strategy

- User list cached until refresh
- Individual user data fetched on-demand
- Panel biomarkers cached per panel

## Security

### Data Protection

- All sensitive operations require admin role
- User IDs validated server-side
- SQL injection prevented via Supabase client
- Input validation on all forms

### Access Control

- Frontend route protection via `ProtectedAdminRoute`
- Backend middleware validation
- Token-based authentication

## Future Enhancements

### Potential Features

1. **Bulk Operations**: Upload CSV of blood test results
2. **Data Export**: Export user data to PDF/Excel
3. **Advanced Analytics**: Trend charts and insights
4. **Notifications**: Alert users of new results
5. **Audit Log**: Track all admin actions
6. **Custom Panels**: Admin-defined panel configurations
7. **Result Approval**: Workflow for result verification

### Performance Improvements

1. Implement pagination for large user lists
2. Virtual scrolling for biomarker lists
3. Debounced search
4. Optimistic updates with rollback

## Troubleshooting

### Common Issues

**Modal doesn't open:**

- Check browser console for errors
- Ensure ModalProvider wraps the app
- Verify user has admin permissions

**Results not saving:**

- Check network tab for API errors
- Verify biomarker IDs match panel
- Ensure all required fields are filled

**Panel not updating:**

- Confirm panel ID is valid
- Check for database constraints
- Verify user_panel_links table exists

## Development

### Running Locally

1. Start backend: `cd apps/backend && pnpm dev`
2. Start frontend: `cd apps/web && pnpm dev`
3. Access dashboard at `/admin/users`

### Adding New Features

1. Create controller in `apps/backend/src/controllers/adminUserManagementController/`
2. Add route in `apps/backend/src/routes/adminUserManagementRouter/`
3. Create component in `apps/web/src/pages/Admin/UserManagement/components/`
4. Update types as needed

## Testing

### Manual Testing Checklist

- [ ] Create user blood test
- [ ] Add biomarker results
- [ ] Update panel assignment
- [ ] Delete blood test
- [ ] View user history
- [ ] Filter/search users
- [ ] Change user role

### Edge Cases to Test

- User with no panel assigned
- Panel with no biomarkers
- Test with no results
- Very long user lists
- Multiple simultaneous edits

## API Response Examples

### Get User Details

```json
{
 "user": {
 "id": "uuid",
 "email": "user@example.com",
 "role": "user",
 "created_at": "2026-01-07T10:00:00Z"
 },
 "profile": {
 "first_name": "John",
 "last_name": "Doe",
 "username": "johndoe"
 },
 "panel": {
 "panel_id": 1,
 "panel": {
 "id": 1,
 "name": "Basic Health",
 "code": "BH001"
 }
 },
 "bloodTests": [...],
 "biomarkerResults": [...]
}
```

### Create Blood Test

```json
{
  "bloodTest": {
    "id": 123,
    "sample_taken_at": "2026-01-07T08:00:00Z",
    "status": "completed",
    "panel": {
      "id": 1,
      "name": "Basic Health",
      "code": "BH001"
    }
  }
}
```

## Contributing

When adding features:

1. Follow existing component patterns
2. Add proper TypeScript types
3. Include error handling
4. Update this documentation
5. Test thoroughly before committing

## License

Part of the Peaklab application.
