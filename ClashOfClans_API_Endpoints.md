# Clash of Clans API – Full Endpoint List (Behitek Wrapper Version)

## Base URL
```
https://coc-apis.behitek.com/
```

**No authentication required.**  
Tags must still be URL‑encoded (`#` → `%23`).

---

# PLAYERS

## GET /players/{playerTag}
Retrieve player profile.

### Example  
Player tag: `#YPG0VGJ09` → `%23YPG0VGJ09`

```
https://coc-apis.behitek.com/players/%23YPG0VGJ09
```

### cURL
```bash
curl "https://coc-apis.behitek.com/players/%23YPG0VGJ09"
```

### Response (snippet)
```json
{
  "tag": "#YPG0VGJ09",
  "name": "Example Player",
  "townHallLevel": 16,
  "trophies": 5400
}
```

---

## POST /players/{playerTag}/verifytoken
Verify player ownership.

### cURL
```bash
curl -X POST "https://coc-apis.behitek.com/players/%23YPG0VGJ09/verifytoken"   -H "Content-Type: application/json"   -d '{ "token": "123abc" }'
```

### Response
```json
{ "status": "ok" }
```

---

# CLANS

## GET /clans?name=
Search clans by name.

### cURL
```bash
curl "https://coc-apis.behitek.com/clans?name=Vietnam"
```

---

## GET /clans/{clanTag}
Retrieve clan profile.

### Example  
Clan tag: `#2G9YRCRV2` → `%232G9YRCRV2`

```
https://coc-apis.behitek.com/clans/%232G9YRCRV2
```

### cURL
```bash
curl "https://coc-apis.behitek.com/clans/%232G9YRCRV2"
```

### Response (snippet)
```json
{
  "tag": "#2G9YRCRV2",
  "name": "Clan Name",
  "members": 50
}
```

---

## GET /clans/{clanTag}/members

### cURL
```bash
curl "https://coc-apis.behitek.com/clans/%232G9YRCRV2/members"
```

---

## GET /clans/{clanTag}/warlog

### cURL
```bash
curl "https://coc-apis.behitek.com/clans/%232G9YRCRV2/warlog"
```

---

## GET /clans/{clanTag}/currentwar

### cURL
```bash
curl "https://coc-apis.behitek.com/clans/%232G9YRCRV2/currentwar"
```

---

# LEAGUES

## GET /leagues

### cURL
```bash
curl "https://coc-apis.behitek.com/leagues"
```

---

## GET /leagues/{leagueId}

### cURL
```bash
curl "https://coc-apis.behitek.com/leagues/29000022"
```

---

# LOCATIONS

## GET /locations

### cURL
```bash
curl "https://coc-apis.behitek.com/locations"
```

---

## GET /locations/{locationId}

### cURL
```bash
curl "https://coc-apis.behitek.com/locations/32000006"
```

---

## GET /locations/{locationId}/rankings/players

### cURL
```bash
curl "https://coc-apis.behitek.com/locations/32000006/rankings/players"
```

---

## GET /locations/{locationId}/rankings/clans

### cURL
```bash
curl "https://coc-apis.behitek.com/locations/32000006/rankings/clans"
```

---

# LABELS

## GET /labels/clans
```bash
curl "https://coc-apis.behitek.com/labels/clans"
```

## GET /labels/players
```bash
curl "https://coc-apis.behitek.com/labels/players"
```

---

# GOLD PASS

## GET /goldpass
```bash
curl "https://coc-apis.behitek.com/goldpass"
```

---

# WAR LEAGUES

## GET /warleagues
```bash
curl "https://coc-apis.behitek.com/warleagues"
```

## GET /warleagues/{leagueId}
```bash
curl "https://coc-apis.behitek.com/warleagues/48000010"
```

---

# BUILDER BASE

## GET /builderbase/leagues
```bash
curl "https://coc-apis.behitek.com/builderbase/leagues"
```

---

# TOURNAMENTS (if supported)

## GET /tournaments
```bash
curl "https://coc-apis.behitek.com/tournaments"
```

---

# ERROR RESPONSE EXAMPLE

```json
{
  "reason": "notFound",
  "message": "Resource not found"
}
```

---

If you need an **OpenAPI spec**, **Postman collection**, or **TypeScript/Python SDK**, I can generate them automatically.
