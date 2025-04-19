// Programming languages available in the code editor
export const PROGRAMMING_LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
  ];
  
  // Question difficulty levels with their styling
  export const DIFFICULTY_LEVELS = {
    EASY: {
      label: 'Easy',
      className: 'bg-green-100 text-green-700',
    },
    MEDIUM: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-700',
    },
    HARD: {
      label: 'Hard',
      className: 'bg-red-100 text-red-700',
    },
  };
  
  // Coding problems/questions
  export const CODING_QUESTIONS = [
    {
      id: 1,
      title: "Count the Number of Good Subarrays",
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      description: `Given an integer array nums and an integer k, return the number of good subarrays of nums.
        
  A subarray arr is good if there are at least k pairs of indices (i, j) such that i < j and arr[i] == arr[j].
  
  A subarray is a contiguous non-empty sequence of elements within an array.`,
      example: `Input: nums = [1,1,1,1], k = 10
  Output: 1
  Explanation: The only good subarray is the array nums itself.`,
      testCases: [
        {
          input: {
            nums: [1,1,1,1],
            k: 10
          },
          output: 1
        },
        {
          input: {
            nums: [3,1,4,3,2,2,4],
            k: 2
          },
          output: 4
        },
      ],
      starterCode: {
        javascript: `function countGood(nums, k) {
    // Write your solution here
    
  }`,
        python: `def count_good(nums, k):
      # Write your solution here
      pass`,
        java: `class Solution {
      public long countGood(int[] nums, int k) {
          // Write your solution here
          
      }
  }`,
        cpp: `class Solution {
  public:
      long long countGood(vector<int>& nums, int k) {
          // Write your solution here
          
      }
  };`
      }
    },
    {
      id: 2,
      title: "Two Sum",
      difficulty: DIFFICULTY_LEVELS.EASY,
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        
  You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
      example: `Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
      testCases: [
        {
          input: {
            nums: [2,7,11,15],
            target: 9
          },
          output: [0,1]
        },
        {
          input: {
            nums: [3,2,4],
            target: 6
          },
          output: [1,2]
        },
        {
          input: {
            nums: [3,3],
            target: 6
          },
          output: [0,1]
        }
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Write your solution here
    
  }`,
        python: `def two_sum(nums, target):
      # Write your solution here
      pass`,
        java: `class Solution {
      public int[] twoSum(int[] nums, int target) {
          // Write your solution here
          
      }
  }`,
        cpp: `class Solution {
  public:
      vector<int> twoSum(vector<int>& nums, int target) {
          // Write your solution here
          
      }
  };`
      }
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      difficulty: DIFFICULTY_LEVELS.EASY,
      description: `You are given the heads of two sorted linked lists list1 and list2.
        
  Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.`,
      example: `Input: list1 = [1,2,4], list2 = [1,3,4]
  Output: [1,1,2,3,4,4]`,
      testCases: [
        {
          input: {
            list1: [1,2,4],
            list2: [1,3,4]
          },
          output: [1,1,2,3,4,4]
        },
        {
          input: {
            list1: [],
            list2: []
          },
          output: []
        },
        {
          input: {
            list1: [],
            list2: [0]
          },
          output: [0]
        }
      ],
      starterCode: {
        javascript: `function mergeTwoLists(list1, list2) {
    // Write your solution here
    
  }`,
        python: `def merge_two_lists(list1, list2):
      # Write your solution here
      pass`,
        java: `class Solution {
      public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
          // Write your solution here
          
      }
  }`,
        cpp: `class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          // Write your solution here
          
      }
  };`
      }
    },
    {
      id: 4,
      title: "Valid Parentheses",
      difficulty: DIFFICULTY_LEVELS.EASY,
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
  
  An input string is valid if:
  1. Open brackets must be closed by the same type of brackets.
  2. Open brackets must be closed in the correct order.
  3. Every close bracket has a corresponding open bracket of the same type.`,
      example: `Input: s = "()[]{}"
  Output: true
  
  Input: s = "(]"
  Output: false`,
      testCases: [
        {
          input: {
            s: "()[]{}"
          },
          output: true
        },
        {
          input: {
            s: "(]"
          },
          output: false
        },
        {
          input: {
            s: "([)]"
          },
          output: false
        },
        {
          input: {
            s: "{[]}"
          },
          output: true
        }
      ],
      starterCode: {
        javascript: `function isValid(s) {
    // Write your solution here
    
  }`,
        python: `def is_valid(s):
      # Write your solution here
      pass`,
        java: `class Solution {
      public boolean isValid(String s) {
          // Write your solution here
          
      }
  }`,
        cpp: `class Solution {
  public:
      bool isValid(string s) {
          // Write your solution here
          
      }
  };`
      }
    },
    {
      id: 5,
      title: "Maximum Subarray",
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.
  
  A subarray is a contiguous non-empty sequence of elements within an array.`,
      example: `Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
  Output: 6
  Explanation: The subarray [4,-1,2,1] has the largest sum 6.`,
      testCases: [
        {
          input: {
            nums: [-2,1,-3,4,-1,2,1,-5,4]
          },
          output: 6
        },
        {
          input: {
            nums: [1]
          },
          output: 1
        },
        {
          input: {
            nums: [5,4,-1,7,8]
          },
          output: 23
        }
      ],
      starterCode: {
        javascript: `function maxSubArray(nums) {
    // Write your solution here
    
  }`,
        python: `def max_sub_array(nums):
      # Write your solution here
      pass`,
        java: `class Solution {
      public int maxSubArray(int[] nums) {
          // Write your solution here
          
      }
  }`,
        cpp: `class Solution {
  public:
      int maxSubArray(vector<int>& nums) {
          // Write your solution here
          
      }
  };`
      }
    }
  ];
  
  // Sample test results for success and error states
  export const SAMPLE_TEST_RESULTS = {
    SUCCESS: {
      status: 'success',
      message: 'Your code passed all test cases!',
      details: 'Runtime: 56 ms, faster than 95.32% of submissions. Memory Usage: 42.1 MB, less than 87.42% of submissions.'
    },
    ERROR: {
      status: 'error',
      message: 'Your code failed on some test cases.',
      details: 'Test case 3 failed: Expected [1,1,2,3,4,4], but got [1,1,2,4,3,4]'
    }
  };
  
  // UI element configuration
  export const UI_CONFIG = {
    // Common classnames for consistent styling
    BUTTON_STYLES: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-indigo-600 hover:bg-indigo-700 text-white", 
      outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
    },
    
    // Animation durations
    ANIMATIONS: {
      codeTyping: 500, // ms
      fadeIn: 300, // ms
    },
    
    // Profile image placeholder or default
    PROFILE_IMAGE: "./../public/pratik.jpg", // Replace with your actual path
    
    // Editor configuration
    EDITOR: {
      fontSize: "14px",
      tabSize: 2,
      theme: "vs-dark", // For advanced editors like Monaco
      lineNumbers: true,
      autoIndent: true,
    }
  };
  
  // Result messages for different test outcomes
  export const RESULT_MESSAGES = {
    TIME_LIMIT_EXCEEDED: {
      status: 'error',
      message: 'Time Limit Exceeded',
      details: 'Your solution took too long to execute. Try to optimize your algorithm.'
    },
    COMPILATION_ERROR: {
      status: 'error',
      message: 'Compilation Error',
      details: 'There are syntax errors in your code. Please fix them before running.'
    },
    RUNTIME_ERROR: {
      status: 'error',
      message: 'Runtime Error',
      details: 'Your code threw an exception during execution. Check for edge cases.'
    },
    WRONG_ANSWER: {
      status: 'error',
      message: 'Wrong Answer',
      details: 'Your solution does not produce the expected output for all test cases.'
    },
    ACCEPTED: {
      status: 'success',
      message: 'All Tests Passed',
      details: 'Congratulations! Your solution works correctly for all test cases.'
    },
  };