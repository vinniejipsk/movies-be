import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';

import { submitReview } from '../../service/reviews';
import { getUser } from '../../service/users';
import { getToken } from '../../util/security';

const defaultTheme = createTheme();

export default function CreateReviewForm() {
  const [reviewForm, setReviewForm] = useState({
    userId: '',
    game: null,
    platform: null,
    rating: null,
    description: ''
  });

  useEffect(() => {
    const user = getUser();
    console.log(getUser);
    if (user) {
      // Assuming 'user' contains the username or user ID
      setReviewForm(prevState => ({ ...prevState, userId: user }));
      console.log("User logged in useEffect");
    } else {
      console.log("User is not logged in useEffect");
      // Optionally, redirect to login page or disable form
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const handleAutocompleteChange = (name) => (event, value) => {
    const newValue = value && value.label ? value.label : value;
    setReviewForm({ ...reviewForm, [name]: newValue });
  };

  const handleRatingChange = (event, value) => {
    const newRating = value && value.label ? parseInt(value.label, 10) : value;
    setReviewForm({ ...reviewForm, rating: newRating });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
  
    // Retrieve the token and decode its payload
    const token = getToken();
    console.log(token)
    const payload = token ? JSON.parse(atob(token.split(".")[1])).payload : null;
    console.log(payload)
  
    // Check if the payload exists and has the user ID
    if (payload && payload._id) {
      // Update the review form with the user ID
      const updatedReviewForm = { ...reviewForm, userId: payload._id };
  
      try {
        if (!updatedReviewForm.game || !updatedReviewForm.platform || updatedReviewForm.rating === null || !updatedReviewForm.description) {
          alert('Please fill in all fields');
          return;
        }
  
        const response = await submitReview(updatedReviewForm);
        console.log('Review submitted successfully', response);
  
        // Clear the form after submission
        setReviewForm({ game: null, platform: null, rating: null, description: '', userId: '' });
      } catch (e) {
        console.error('Error submitting review', e);
        alert('Error submitting review');
      }
    } else {
      console.error("User is not logged in");
      alert("Please log in to submit a review");
    }
  }  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Create your own review!
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Autocomplete
                  disablePortal
                  id="game"
                  options={gamelist}
                  value={reviewForm.game}
                  onChange={handleAutocompleteChange('game')}
                  isOptionEqualToValue={(option, value) => option.label === value}
                  renderInput={(params) => <TextField {...params} label="Game" />}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  disablePortal
                  id="platform"
                  options={platformlist}
                  value={reviewForm.platform}
                  onChange={handleAutocompleteChange('platform')}
                  isOptionEqualToValue={(option, value) => option.label === value}
                  renderInput={(params) => <TextField {...params} label="Platforms" />}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  disablePortal
                  id="rating"
                  options={ratinglist}
                  value={reviewForm.rating}
                  onChange={handleRatingChange}
                  getOptionLabel={(option) => option.toString()}
                  renderInput={(params) => <TextField {...params} label="Rating" />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={10} 
                  value={reviewForm.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit Review
            </Button>
            <input
              type="hidden"
              name="userId"
              value={reviewForm.userId}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const gamelist = [
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
];

const platformlist = [
  { label: 'PC' },
  { label: 'Mac' },
  { label: 'PS5' },
  { label: 'PS4' },
  { label: 'Xbox One' },
  { label: 'Xbox 360' },
  { label: 'Nintendo Switch' },
  { label: 'Android' },
  { label: 'iOS' },
];

const ratinglist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];