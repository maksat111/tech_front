import React, { useState, useEffect, createContext } from "react";

export const SebedimContext = createContext();

const SebedimContextProvider = (props) => {
  let localData;
  const harytlar = localStorage.getItem("sebedim");
  if (harytlar) {
    localData = JSON.parse(harytlar);
  } else {
    localData = [];
  }

  const [sebedim, setSebedim] = useState(localData);

  const Increment = async (id, sany) => {
    let haryt;
    let num;
    await sebedim.map((sebet, no) => {
      if (sebet._id === id) {
        haryt = sebet;
        num = no;
      }

      return null;
    });

    if (sany) {
      haryt.sany = parseInt(haryt.sany) + sany;
    } else {
      haryt.sany = parseInt(haryt.sany) + 1;
    }

    let sebet = [];

    await sebedim.map((obj, index) => {
      if (index === num) {
        sebet.push(haryt);
      } else {
        sebet.push(obj);
      }

      return null;
    });

    setSebedim(sebet);
  };

  const Decrement = async (id, sany) => {
    let haryt;
    let num;

    await sebedim.map((sebet, no) => {
      if (sebet._id === id) {
        haryt = sebet;
        num = no;
        return null;
      }
    });

    if (haryt.sany > 1) {
      haryt.sany = parseInt(haryt.sany) - 1;
    }

    let sebet = [];
    await sebedim.map((obj, index) => {
      if (index === num) {
        sebet.push(haryt);
      } else {
        sebet.push(obj);
      }

      return null;
    });

    setSebedim(sebet);
  };

  const AddTo = async (id, name, baha, image) => {
    let barmy = false;
    await sebedim?.map((haryt) => {
      if (haryt._id === id) {
        Increment(id);
        barmy = true;
      }

      return null;
    });

    if (!barmy) {
      let harytlar = sebedim;
      harytlar.push();
      setSebedim([
        ...sebedim,
        {
          _id: id,
          name,
          sany: 1,
          baha,
          image,
        },
      ]);
    }
  };

  const AddToMany = async (id, name, baha, sany, image) => {
    let barmy = false;
    await sebedim.map((haryt) => {
      if (haryt.id === id) {
        Increment(id, sany);
        barmy = true;
      }

      return null;
    });

    if (!barmy) {
      let harytlar = sebedim;
      harytlar.push();
      setSebedim([
        ...sebedim,
        {
          id,
          name,
          sany,
          baha,
          image,
        },
      ]);
    }
  };

  const Remove = async (id) => {
    const harytlar = await sebedim.filter((haryt) => {
      return id !== haryt._id;
    });
    setSebedim(harytlar);
  };

  useEffect(() => {
    localStorage.setItem("sebedim", JSON.stringify(sebedim));
  }, [sebedim]);

  const [selectedCategory, setSelectedCategory] = useState();

  return (
    <SebedimContext.Provider
      value={{
        sebedim,
        Increment,
        Decrement,
        AddTo,
        AddToMany,
        Remove,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {props.children}
    </SebedimContext.Provider>
  );
};

export default SebedimContextProvider;
