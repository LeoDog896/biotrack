# biotrack
store anonymous biometric information on uuid-identified users in private networks

## Database

```
surreal start memory --auth --user root --pass root
surreal import --conn http://localhost:8000 --user root --pass root --ns data --db data schema.surql
```
