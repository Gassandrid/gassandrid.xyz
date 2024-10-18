---
id: Brahms - Agent Oriented Programming
aliases: 
tags:
  - cs
  - ai
date: 2024-10-17
---

> [!Note]
> Brahms is a specialized agent-based programming language designed for modeling and simulating human work practices. It integrates multiple tools, including a compiler, virtual machine, and integrated development environment (IDE), to support agent development, simulation, and analysis.

## Components of Brahms

### The Compiler

- **Purpose**: Parses and compiles Brahms models (programs) into an executable format.
- **Output Format**: XML, compliant with Brahms Document Type Definition (DTD).
- **Usage**:

  ```bash
  bc [options] <Brahms file>
  ```

- **Options**:
	- `-lp <library-path />`: Set library path.
	- `-source <source-path />`: Set source code path.
	- `-d <destination-path />`: Set destination path.
	- `-uml`: Generate UML for the model.
	- `-debug`: Display debug information.
	
> [!Tip]
> The compiler is integrated with the Brahms Composer to streamline development. Check the [Known Issues] before reporting bugs.

### The Virtual Machine (VM)

- **Purpose**: Executes compiled Brahms models.
- **Implementation**: Written in Java, allowing Brahms agents to run as Java threads.
- **Modes of Operation**:
	- **Simulation (sim)**: Runs models as simulations.
	- **Real-time (rt)**: Executes models in real-time.
	- **Distributed Real-time (drt)**: Supports distributed execution across multiple virtual machines.
- **Usage**:

  ```bash
  bvm [-options] [<model>]
  ```

- **Options**:
	- `-cf <config file />`: Use specified configuration file.
	- `-mode (sim | rt | drt)`: Choose simulation mode.
	- `-random_seed <n />`: Seed for random number generator.
	- `-time_unit <n />`: Time units represented by seconds.
	
> [!Note]
>  The VM can handle distributed systems, scaling to hundreds of thousands of agents across multiple machines.

### The Composer (IDE)

- **Purpose**: Integrated Development Environment for Brahms model design and execution.
- **Features**:
	- **Graphical Designers**: Visualize agents, objects, and interactions.
	- **Source Code Editor**: Syntax highlighting and error checking.
	- **Package Explorer**: Organizes source files and packages.
	- **Task List**: Displays syntax and semantic errors for quick navigation.

> [!Tip]
>  You can generate complete models using only graphical designers, without manually writing source code.

### Agent Viewer

- **Purpose**: Visualizes and analyzes agent behavior and state over time.
- **Key Views**:
	- **Runtime View**: Displays agents active in the system.
	- **Timeline View**: Shows agent activities over time.
	- **Communication View**: Visualizes inter-agent communication.
	- **Explanation Facility**: Analyzes triggers, beliefs, and actions for deeper insight.

> [!Note]
>  The agent history is stored in a MySQL database and can be analyzed using SQL or Brahms' Agent Viewer.

## Brahms Agents

### Defining Agents and Groups

Brahms agents are members of groups, supporting multiple inheritance. For example:

```brahms
group PersonalAgent { ... }  // define group
agent JohnPersonalAgent memberof PersonalAgent { ... }  // define agent
agent Agent2 memberof PersonalAgent, AnotherGroup { ... }  // multiple inheritance
```

### Belief-Based Agents

Unlike object-oriented languages, where objects encapsulate attributes, Brahms agents have beliefs about the attributes of agents, objects, and areas.

Example:

```brahms
agent LouisArmstrong memberof Artist {
  initial_beliefs:
    (current.performs = WhatAWonderfulWorld);
    (EdithPiaf.performs = LaVieEnRose);
}
```

> **Key Concept**: Beliefs are propositional sentences, allowing agents to reason based on their beliefs and make intelligent decisions.

### Behavior Through Workframes

Workframes define agent actions based on preconditions. Below is an example of an agent singing a song:

```brahms
group Artist {
  workframes:
    workframe SingASong {
      variables:
        foreach(Song) a_song;
      when ((current.performs = a_song) and not(current.has_performed = a_song))
      do {
        sing(a_song);
        conclude((current.has_performed = a_song));
      }
    }
}
```

> [!Tip]
>  Agents act autonomously, and workframes trigger based on the agent's current beliefs.

## Integration with Java: JAPI

- **Purpose**: Brahms integrates with Java through the Java Application Programming Interface (JAPI).
- **Usage**: Allows interaction between Brahms agents and external Java components, enabling complex, hybrid systems.

## Eclipse Plugin

- **Features**:
  - Package management, source code editing, and compilation.
  - Integrated Agent Viewer.
- **Requirements**: Eclipse 3.5+ and JSE 5+.

> [!Note]
>  The Eclipse plugin is a lighter alternative to the Composer but lacks full design editing capabilities.

---

> [!summary] **Brahms Summary**
>
> - Brahms is a multi-component system designed for modeling, simulating, and analyzing agent-based systems.
> - Agents use beliefs to reason and act autonomously.
> - Brahms integrates with Java, supporting complex systems.
> - The Brahms Composer and Agent Viewer streamline development and analysis.
