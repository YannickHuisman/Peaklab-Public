Place auth mock files here. Runtime mapping used by the app:

- `/api/auth/session` -> `/mockdata/auth/session.json`
- `/api/auth/profile` -> `/mockdata/auth/profile.json`

Examples (already provided):

`session.json`:

```
{
  "user": {
    "id": "1",
    "email": "alice@example.com",
    "app_metadata": { "role": "admin" }
  }
}
```

`profile.json`:

```
{
  "profile": {
    "email": "alice@example.com",
    "first_name": "Alice",
    "last_name": "Anderson",
    "username": "alice"
  }
}
```

If you enable `VITE_EXPORT_MOCKS=true`, the app will populate `window.__EXPORT_MOCKS.auth` in the browser console — copy that JSON into these files to match your live backend.
