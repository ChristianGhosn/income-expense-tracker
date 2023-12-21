import React, { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CategoryCombobox = ({ selectedCategory, setSelectedCategory }) => {
  const inputClasses = `w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-purple text-sm`;
  const inputClassesErrors = "ring-red-400";

  const { user } = useAuth();

  const navigate = useNavigate();

  const [searchField, setSearchField] = useState("");
  const [categories, setCategories] = useState([]);

  const filteredCategory =
    searchField === ""
      ? categories
      : categories.filter((category) => {
          return category.label
            .toLowerCase()
            .includes(searchField.toLowerCase());
        });

  const fetchCategories = async () => {
    if (!user) {
      return navigate("/login");
    }
    try {
      const categoriesCollection = collection(db, "categories");
      const q = query(categoriesCollection, orderBy("label", "asc"));
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchDataOnMount = async () => {
      try {
        await fetchCategories();
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDataOnMount();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="relative w-full">
      <Combobox value={selectedCategory} onChange={setSelectedCategory}>
        <Combobox.Input
          onChange={(e) => setSearchField(e.currentTarget.value)}
          placeholder="Category..."
          displayValue={(category) => category.label}
          className={inputClasses}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown size={15} />
        </Combobox.Button>
        <Combobox.Options className="absolute max-h-60 w-full overflow-auto rounded-b-md bg-white border-0 ring-1 ring-inset ring-gray-300 text-gray-900">
          {filteredCategory.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredCategory.map((category) => (
              <Combobox.Option
                key={category.id}
                value={category}
                className="relative py-2 px-4 cursor-pointer select-none hover:bg-royal-purple hover:text-white w-full"
              >
                {category.label}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

export default CategoryCombobox;
