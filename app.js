import express from 'express';
import pets from './petList.js';

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send(`
        <h1>Adopt a Pet</h1>
        <p>Browse through the links below to find your new furry friend:</p>
        <ul>
            <li><a href="/animals/dogs">Dogs</a></li>
            <li><a href="/animals/cats">Cats</a></li>
            <li><a href="/animals/rabbits">Rabbits</a></li>
        </ul>
  `);
});

app.get('/animals/:petType', (req, res) => {
  const {
    params: { petType }
  } = req;

  const listOfAnimals = pets[petType]
    ?.map(pet => `<li><a href="/animals/${petType}/${pet.name.toLowerCase()}">${pet.name}</a></li>`)
    .join('');

  if (listOfAnimals) {
    res.send(`
    <h1>List of ${petType}</h1>
    <ul>
      ${listOfAnimals}
    </ul>
`);
  } else {
    res.send('Not found');
  }
});

app.get('/animals/:petType/:petId', (req, res) => {
  const {
    params: { petType, petId }
  } = req;
  const listOfAnimals = pets[petType];

  if (!listOfAnimals) {
    return res.send(`Sorry! It seems we don't have ${petType}`);
  }

  const pet = listOfAnimals.find(a => a.name.toLowerCase() === petId);

  if (!pet) {
    return res.send(
      `Hey it seems that ${petId} is no longer here. Maybe it was already adopted <3`
    );
  }

  res.send(`
    <h1>${pet.name}</h1>
    <img src=${pet.url} alt=${pet.name} width='300px'/>
    <p>${pet.description}</p>
    <ul>
        <li>Age: ${pet.age}</li>
        <li>Breed: ${pet.breed}</li>
    </ul>
  `);
});

app.get('/api/animals', (req, res) => {
  res.json(pets);
});

app.get('/api/animals/:petType', (req, res) => {
  const {
    params: { petType }
  } = req;
  res.json(pets[petType]);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
