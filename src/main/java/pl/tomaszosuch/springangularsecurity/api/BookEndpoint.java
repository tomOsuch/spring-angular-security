package pl.tomaszosuch.springangularsecurity.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.tomaszosuch.springangularsecurity.model.Book;
import pl.tomaszosuch.springangularsecurity.repository.BookRepository;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
public class BookEndpoint {

    private BookRepository bookRepository;

    @Autowired
    public BookEndpoint(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping("/api/books")
    public List<Book> getAll() {
        return bookRepository.findAll();
    }

    @GetMapping("/api/books/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Book> book = bookRepository.findById(id);
        if(book != null) {
            return ResponseEntity.ok(book);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/books")
    public ResponseEntity<?> save(@RequestBody Book book) {
        if(book.getId() == null) {
            Book saved = bookRepository.save(book);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(saved.getId())
                    .toUri();
            return ResponseEntity.created(location).body(book);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
