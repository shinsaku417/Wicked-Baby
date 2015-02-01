[![Stories in Ready](https://badge.waffle.io/wicked-baby/wicked-baby.png?label=ready&title=Ready)](https://waffle.io/wicked-baby/wicked-baby)
# Diss-No-Sense

"Diss-No-Sense" is an anonymous thumbs-check app for Hack Reactor students. Often, the feedback loop between a teacher's progressing instruction and a student's burgeoning comprehension is broken due to a lack of clear, honest and quick communication. Thumb-check-polls are a common pedagogical method used to ensure that teaching points are communicated effectively to student audiences. Students give a “thumbs up” to convey “I understand the lesson thus far” and a “thumbs down” to convey the opposite. The problem with the standard thumbs-check, however, is that many students who would otherwise raise a thumbs down, don't do so because of fear of judgement.

“Diss-No-Sense” seeks to improve the thumb-check poll in two ways. For students, Diss-No-Sense eliminates the anxiety associated with reporting a thumbs down through anonymous polling. For teachers, Diss-No-Sense visualizes polling results in a simple graph, allowing for a constant assessment of instructional success. 

## Team

- __Product Owner__: Ryan McCarter
- __Scrum Master__: Sasha Bayan
- __Development Team Members__: Hou Chia, Shin Uesugi

## Table of Contents

1. [Usage](#Usage)
1. [Technology Stack](#Technology Stack)
1. [Development](#development)
1. [Installing Dependencies](#installing-dependencies)
1. [Product Backlog](#Product Backlog)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

Instructor and students can both use Diss-No-Sense to make learning fun, interactive, and productive. 

How the instructor can use Diss-No-Sense:
> 1. Log in with Github.
2. Set a threshold. If the percentage of students who are 'confused' at any given time is greater than
the threshold, Diss-No-Sense will alert the instructor. 
3. After the instructor resolves the confusion, the instructor clicks on the 'Resolved' button to reset
the confusion rate to 0.
4. Click on 'Go to Dashboard' to see a graph of number of 'I'm confused :(' clicks against student usernames.  

How the student can use Diss-No-Sense:
> 1. Log in with Github. 
2. Click on 'I'm confused :(' if you're feeling confused at any point in class.
3. Click on 'I'm good now :)' if you're no longer confused.


## Technology Stack
Our team used the following technologies to create Diss-No-Sense:
> 1. HTML/CSS/Javascript
2. Socket.io
3. AngularJS
4. Node/Express
5. MySQL/Sequelize

## Development

### Installing Dependencies

From within the root directory:
```sh
sudo npm install -g bower
npm install
bower install
```

### Product Backlog

View the product backlog [here](https://github.com/Wicked-Baby/Wicked-Baby/issues)


## Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
